import React, { useState,useEffect } from "react";
import { Contents } from "./createcontent";
import { Photoupload } from "./Photoupload";
import {Navbar} from "./Home";
import {HomePage} from "./HomePage";
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
    <div className="min-h-screen bg-black">
      <Navbar />
    
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/createcontent" element={<Contents additem={addContent} />} />
          <Route path="/Photoupload" element={<Photoupload />} />
          <Route path="/" element={<HomePage post={post} />} />
          <Route path="/Login" element={<Login/>} />
          <Route path="/article/:articleId" element={<FullArticle />} />
          <Route path="/user-details/:email" element={<UserDetails />} />
        </Routes>
      </div>
      
    </div>
  );
}