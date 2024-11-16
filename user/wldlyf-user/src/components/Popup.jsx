import React, { useEffect } from "react";

export default function Modal({ isOpen, toggleModal }) {
  
  const onDonate = () => {
    alert('Thank you for your donation! Your offer has been successfully donated to wildlife preservation.');
    toggleModal(); 
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 animate-pop">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold mb-4">Wild Life Preservation</h2>
            <p>
              You have an option, The offer gained by you can be donated for WildLife preservation <br />
              <i>!! The amount allocated for your offer by the respective brand or organization will be transferred for Wild Life preservation !!</i>
              <center>! If you prefer donating, you can click "Donate" or else click "Close"</center>
            </p>
          </div>
          <div className="bg-gray-100 px-6 py-4 rounded-b-lg flex justify-between">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={onDonate}
            >
              Donate
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
