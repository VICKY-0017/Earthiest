import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Showcntnt } from "./content";
import axios from "axios";
import { ArrowRight, Plus } from "lucide-react";

export function HomePage() {
  const [postList, setPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://wyldlyf-orginal-bknd.onrender.com/posts"
      );
      setPostList(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`https://wyldlyf-orginal-bknd.onrender.com/posts/${id}`);
      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/TreeVideo.mp4"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-white">
          <h1 className="text-7xl font-bold mb-4 tracking-tight">
            Earthiest
          </h1>
          <p className="text-3xl font-light italic mb-8">
            Planting Lives, Growing Future
          </p>
          <div>
            <Link 
              to="/createcontent"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="py-16 px-4 md:px-8">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Featured Stories
        </h2>
        <div className="flex overflow-x-auto gap-8 pb-8 px-4 snap-x snap-mandatory">
          {["/giphy.gif", "/giphy2.gif", "/giphy3.gif", "/giphy.gif", "/giphy5.gif"].map((src, index) => (
            <div 
              key={index}
              className="min-w-[350px] snap-center rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white"
            >
              <div className="relative h-[400px] overflow-hidden">
                <img 
                  src={src} 
                  alt={`Featured ${index + 1}`}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Nature's Story {index + 1}</h3>
                  <p className="text-sm opacity-90">Discover the beauty of our planet</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Posts Section */}
      <div className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
            Latest Posts
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
            </div>
          ) : postList.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <div className="mb-6">
                <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-700">No Posts Yet</h3>
              <p className="text-gray-500 mb-8">Be the first to share your story with the world!</p>
              <Link 
                to="/createcontent"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300"
              >
                Create Your First Post
                <Plus className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {postList.map((item, index) => (
                <div key={index}>
                  <Showcntnt
                    id={index}
                    photo={item.image || "/uploads/placeholder.jpg"}
                    title={item.title}
                    content={item.content}
                    articleId={item._id}
                    onDelete={() => deletePost(item._id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
