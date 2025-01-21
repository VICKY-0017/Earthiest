import React from "react";
import { useNavigate } from "react-router-dom";

export function Showcntnt({ photo, title, content, onDelete, articleId }) {
  const navigate = useNavigate();
  
  const handleReadMore = () => {
    navigate(`/article/${articleId}`);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition duration-300 transform hover:scale-105 h-[500px] flex flex-col">
      <div className="h-64 w-full overflow-hidden">
        <img 
          src={photo.startsWith('http') ? photo : `https://wyldlyf-orginal-bknd.onrender.com/${photo}`} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h2 className="font-bold text-xl mb-3 text-white line-clamp-2">{title}</h2>
        <p className="text-gray-400 line-clamp-3 mb-4 flex-1">
          {content ? content : "No content available"}
        </p>
        
        <div className="mt-auto">
          <button
            onClick={handleReadMore}
            className="w-full px-4 py-2 border-2 border-green-600 text-green-600
                      rounded-md font-medium hover:bg-green-600 hover:text-white
                      transform hover:-translate-y-1
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
}
