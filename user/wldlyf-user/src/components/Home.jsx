// Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase"; // Import Firebase authentication
import { signOut, onAuthStateChanged } from "firebase/auth";

export function Navbar() {
  const [user, setUser] = useState(null); // State to store the logged-in user
  const navigate = useNavigate();

  useEffect(() => {
    // Track the authenticated user
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // const handleLogout = async () => {
  //   await signOut(auth);
  //   navigate("/"); // Redirect to the home page after logout
  // };

  useEffect(() => {
    console.log("User data:", user);
  }, [user]);



  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <Link to="/" className="flex items-center py-4 px-2">
              <span className="font-semibold text-white text-lg">Earthiest</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/" className="py-4 px-2 text-white font-semibold hover:text-green-500 transition duration-300">
              Home
            </Link>
            <Link to="/createcontent" className="py-4 px-2 text-white font-semibold hover:text-green-500 transition duration-300">
              Create Content
            </Link>
            <Link to="/Photoupload" className="py-4 px-2 text-white font-semibold hover:text-green-500 transition duration-300">
              Photo Upload
            </Link>
            

            {user ? (
  <div className="flex items-center space-x-3">
    <Link
      to={`/user-details/${user.email}`}
      className="text-white font-semibold hover:underline"
    >
      {user.displayName || user.email}
    </Link>
    {/* <button
      onClick={handleLogout}
      className="w-full px-1 py-1 border-1 border-purple-600 text-purple-600
                rounded-full font-medium hover:bg-purple-600 hover:text-white
                transform hover:scale-105
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">    
      Logout
    </button> */}
  </div>
) : (
  <Link to="/Login" className="py-4 px-2 text-white font-semibold hover:text-green-500 transition duration-300">
    Login
  </Link>
)}





          </div>
        </div>
      </div>
    </nav>
  );
}
