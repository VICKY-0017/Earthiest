import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Users, FileText, Gift, Loader2 } from "lucide-react";

export default function UserDetails() {
  const [posts, setPosts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // Redirect to the home page after logout
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        navigate("/Login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`https://wyldlyf-orginal-bknd.onrender.com/user-details/${user.email}`);
          setPosts(response.data.posts);
          setOffers(response.data.offers);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
              <p className="text-gray-600">{user.displayName}</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-500" />
                Posts
              </h3>
              <span className="bg-blue-100 text-blue-600 py-1 px-3 rounded-full text-sm font-medium">
                {posts.length} total
              </span>
            </div>
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post._id} className="border rounded-lg p-4 hover:border-blue-200 transition-colors">
                    <h4 className="font-semibold text-gray-800 mb-2">{post.title}</h4>
                    <p className="text-gray-600 text-sm">{post.content}</p>
                    {post.image && (

                    <img 
        src={photo.startsWith('http') ? photo : `https://wyldlyf-orginal-bknd.onrender.com/${photo}`} 
        alt={post.title} 
        className="mt-3 rounded-lg w-full h-48 object-cover" 
      />  
                     
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No posts yet. Create your first post!</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Gift className="w-5 h-5 mr-2 text-green-500" />
                Offers
              </h3>
              <span className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-sm font-medium">
                {offers.length} total
              </span>
            </div>
            <div className="space-y-3">
              {offers.length > 0 ? (
                offers.map((offer, index) => (
                  <div 
                    key={index} 
                    className="border rounded-lg p-4 hover:border-green-200 transition-colors"
                  >
                    <p className="text-gray-800">{offer.title}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No offers available yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-6">
  <button
    onClick={handleLogout}
    className="px-4 py-2 border border-purple-600 text-purple-600
              rounded-full font-medium hover:bg-purple-600 hover:text-white
              transform hover:scale-105 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
    Logout
  </button>
</div>
    </div>
  );
}
