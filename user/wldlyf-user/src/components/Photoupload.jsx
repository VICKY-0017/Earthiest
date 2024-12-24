import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "./Popup";
import {auth} from "../firebase/firebase";
import {onAuthStateChanged} from "firebase/auth"


export function Photoupload() {
  const [img, setImage] = useState(null);
  const [responseImg, setResponseImage] = useState(null);
  const [offer, setOffer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();


  const [user , setUser] = useState(null);

  useEffect(()=>{
    const unsubscrb = onAuthStateChanged(auth , (user)=>{
      if(user){
        setUser(user);
      } else {
        setUser(null);
        navigate("/Login");
      }
    });
    return ()=>unsubscrb();
  },[]);


  function handleFile(event) {
    const selectedImg = event.target.files[0];
    if (selectedImg) {
      setImage(selectedImg);
    }
  }


async function fetchRandomOffer(){
  try{
    //const response = await fetch("https://wyldlyf-orginal-bknd.onrender.com/rndm-offers");
    const response = await fetch("http://localhost:8000/rndm-offers");
    if(response.ok){
      const result = await response.json();
      setOffer(result);
      setIsModalOpen(true);
    }else{
      console.error('failed to fetch offers');
    }
  }catch(error){
    console.error('Error fetching offer',error);
  }
}











  async function submitFile(event) {
    event.preventDefault();
    if (img) {
      const formData = new FormData();
      formData.append('file', img);

      try {
        //const response = await fetch('https://wyldlyf-orginal-bknd.onrender.com/upload'
        const response = await fetch('http://localhost:8000/upload', {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const result = await response.json();
          const trimmedResp = result.response.trim().toUpperCase(); // Convert to uppercase to handle any case variations
          if (trimmedResp.includes("YES")) { // Check if the response contains 'YES'
            setResponseImage("/Check_mark_animation.gif");
  
            setTimeout(() => {
              fetchRandomOffer();
            }, 5000);
          } else {
            setResponseImage("/icegif.gif");
          }
          console.log(result);
        } else {
          console.error('File Upload Failed');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="p-8">
        <h2 className="block text-lg font-medium text-gray-700 mb-4">Upload Photo</h2>
        {!responseImg ? (
          <form onSubmit={submitFile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Choose photo</label>
              <input
                type="file"
                onChange={handleFile}
                className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </form>
        ) : (
          <div className="flex justify-center">
            <img src={responseImg} alt="Response" className="max-w-full h-auto" />
          </div>
        )}
        {offer && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700">{offer.title}</h3>
            <p className="text-sm text-gray-600">{offer.description}</p>
            
          </div>
          

        )}
        <Modal isOpen={isModalOpen} toggleModal={() => setIsModalOpen(false)} />





      </div>
    </div>
  );
}
