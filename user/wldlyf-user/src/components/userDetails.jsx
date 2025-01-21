import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Users, FileText, Gift, Trash2 } from "lucide-react";

export default function UserDetails() {
  const [posts, setPosts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`https://wyldlyf-orginal-bknd.onrender.com/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
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
          // Fetch user posts based on email
          const postsResponse = await axios.get(`https://wyldlyf-orginal-bknd.onrender.com/user-posts/${user.email}`);
          setPosts(postsResponse.data || []);
          
          // Fetch user offers
          const offersResponse = await axios.get(`https://wyldlyf-orginal-bknd.onrender.com/user-dashboard/${user.email}`);
          setOffers(Array.isArray(offersResponse.data) ? offersResponse.data : [offersResponse.data]);
        } catch (error) {
          console.error("Error fetching user data:", error.message);
          setPosts([]);
          setOffers([]);
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
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const IconWrapper = ({ icon: Icon, ...props }) => (
    <Icon {...props} />
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <IconWrapper icon={Users} className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
              <p className="text-gray-600">{user?.displayName}</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Posts Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <IconWrapper icon={FileText} className="w-5 h-5 mr-2 text-blue-500" />
                Posts
              </h3>
              <span className="bg-blue-100 text-blue-600 py-1 px-3 rounded-full text-sm font-medium">
                {posts?.length || 0} total
              </span>
            </div>
            <div className="space-y-3">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <div
                    key={post._id}
                    className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex space-x-4">
                        {post.image && (
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">{post.title}</h4>
                          <p className="text-gray-500 text-sm">{post.content}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <IconWrapper icon={Trash2} className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No posts available yet.</p>
              )}
            </div>
          </div>

          {/* Offers Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <IconWrapper icon={Gift} className="w-5 h-5 mr-2 text-green-500" />
                Offers
              </h3>
              <span className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-sm font-medium">
                {offers?.length || 0} total
              </span>
            </div>
            <div className="space-y-3">
              {offers && offers.length > 0 ? (
                offers.map((offer, index) => (
                  <div
                    key={offer.offerId || index}
                    className="border rounded-lg p-4 hover:border-green-200 transition-colors"
                  >
                    <div className="flex space-x-4">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{offer.company}</h4>
                        <p className="text-gray-600">{offer.title}</p>
                        <p className="text-gray-500 text-sm">{offer.content}</p>
                      </div>
                    </div>
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
