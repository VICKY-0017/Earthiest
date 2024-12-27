import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {auth} from "../firebase/firebase";
import {onAuthStateChanged} from "firebase/auth"


export function Contents(props) {
  const [content, setContent] = useState({
    photo: "",
    title: "",
    content: "",
  });
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



  function handleChange(event) {
    const { name, value, files } = event.target;

    if (name === "photo" && files.length > 0) {
      const file = files[0];
      console.log("File selected: ", file);
      setContent((prevVal) => ({
        ...prevVal,
        photo:file,
      }));
    } else {
      setContent((prevVal) => ({
        ...prevVal,
        [name]: value,
      }));
    }
  }


  async function submitCntnt(event) {
    event.preventDefault();
    props.additem(content);

    const formData = new FormData();
    formData.append('email',user.email);
    formData.append('title', content.title);
    formData.append('content', content.content);

     console.log("Uploading file: ", content.photo);
    if (content.photo) {
      formData.append('image', content.photo);
    }

    try {
      //const response = await fetch('https://wyldlyf-orginal-bknd.onrender.com/posts',
      const response = await fetch('https://wyldlyf-orginal-bknd.onrender.com/posts', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Post created successfully!');
        setContent({
          photo: "",
          title: "",
          content: "",
        });
        navigate("/");
      } else {
        const errorMessage = await response.text();
        console.error('Error response:', errorMessage);
        alert('Error creating post');
      }
    } catch (error) {
      alert('Error creating post');
    }

  }





  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="p-8">
        <h2 className="block text-lg font-medium text-gray-700 mb-4">Create New Content</h2>
        <form onSubmit={submitCntnt} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Image</label>
            <input
              type="file"
              onChange={handleChange}
              name="photo"
              className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              onChange={handleChange}
              name="title"
              value={content.title}
              placeholder="Enter title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              onChange={handleChange}
              name="content"
              value={content.content}
              placeholder="Enter your content"
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>
          <div>
            <button
            
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
