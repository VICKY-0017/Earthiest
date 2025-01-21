import React, { useState, useEffect } from "react";
import { Contents } from "./createcontent";
import { Photoupload } from "./Photoupload";
import { Navbar } from "./Home";
import { HomePage } from "./HomePage";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import UserDetails from "./userDetails";
import FullArticle from "./FullArticle";

export default function App() {
  const [post, setPost] = useState([]);

  function addContent(newpost) {
    setPost((prevPost) => {
      return [...prevPost, newpost];
    });
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-white-900">
      <Navbar />
      
      {/* Main content area with proper spacing for navbar */}
      <main className="w-full pt-16">
        <Routes>
          <Route 
            path="/createcontent" 
            element={
              <div className="w-full">
                <Contents additem={addContent} />
              </div>
            } 
          />
          <Route 
            path="/Photoupload" 
            element={
              <div className="w-full">
                <Photoupload />
              </div>
            } 
          />
          <Route 
            path="/" 
            element={
              <div className="w-full">
                <HomePage post={post} />
              </div>
            } 
          />
          <Route 
            path="/Login" 
            element={
              <div className="w-full">
                <Login />
              </div>
            } 
          />
          <Route 
            path="/article/:articleId" 
            element={
              <div className="w-full">
                <FullArticle />
              </div>
            } 
          />
          <Route 
            path="/user-details/:email" 
            element={
              <div className="w-full">
                <UserDetails />
              </div>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}
