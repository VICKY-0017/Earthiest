import React from "react";
import { useNavigate } from "react-router-dom";

export function Showcntnt({ photo, title, content, onDelete, articleId }) {
  const navigate = useNavigate(); // Import and define navigate

  const handleReadMore = () => {
    navigate(`/article/${articleId}`); 
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition duration-300 transform hover:scale-105">
      <img 
        src={photo.startsWith('http') ? photo : `https://wyldlyf-orginal-bknd.onrender.com/${photo}`} 
        alt={title} 
        className="w-full h-48 object-cover" 
      />  

      <div className="p-4">
        <h2 className="font-bold text-xl mb-2 text-white">{title}</h2>
        <p className="text-gray-400">{content.substring(0, 100)}...</p>

        <div className="mt-4 flex space-x-4">
          {/* Updated Read More Button */}
          <button
            onClick={handleReadMore}
            className="px-4 py-2 border-2 border-green-600 text-green-600
                      rounded-md font-medium hover:bg-green-600 hover:text-white
                      transform hover:-translate-y-1
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Read More
          </button>

          {/* Delete Button */}
          <button
            className="px-4 py-2 border-2 border-red-600 text-red-600
                      rounded-md font-medium hover:bg-red-600 hover:text-white
                      shadow-md hover:shadow-red-500/50
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
