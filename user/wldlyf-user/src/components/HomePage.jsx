import React, { useState,useEffect } from "react";

import { Link } from "react-router-dom";
import { Showcntnt } from "./content";
import axios from 'axios'



export function HomePage() {

const [postList, setPostList] = useState([]);

    useEffect(() => {
    fetchPosts();
    }, []);

    const fetchPosts = async() =>{
        try{
            const response = await axios.get("http://localhost:8000/posts");
            setPostList(response.data);

        }catch(err){
            console.log(err);
        }
    };
  
    const deletePost = async(id)=>{
        try{
            await axios.delete(`http://localhost:8000/posts/${id}`);
            fetchPosts();
        }catch(err){
            console.log(err);
        };
    }

    return (
    <div>
        <h1 className="text-4xl font-bold text-center text-white mb-8">Welcome to Our Content Hub</h1>
        
        {/* Featured Section */}
        <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Featured Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
            <img src="/giphy.gif" alt="Featured 1" className="w-full h-48 object-cover" />
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gray-800 opacity-70">
                <h3 className="text-xl text-white font-bold">Featured Item 1</h3>
            </div>
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-lg">
            <img src="/giphy2.gif" alt="Featured 2" className="w-full h-48 object-cover" />
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gray-800 opacity-70">
                <h3 className="text-xl text-white font-bold">Featured Item 2</h3>
            </div>
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-lg">
            <img src="/giphy3.gif" alt="Featured 3" className="w-full h-48 object-cover" />
            <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gray-800 opacity-70">
                <h3 className="text-xl text-white font-bold">Featured Item 3</h3>
            </div>
            </div>
        </div>
        </div>

        
        <h2 className="text-2xl font-bold text-white mb-4">Latest Posts</h2>
        {postList.length === 0 ? (
        <div className="text-center text-gray-400">
            <p>No content available yet. Start by creating some!</p>
            <Link to="/createcontent" className="mt-4 inline-block bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300">Create Content</Link>
        </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postList.map((item, index) => (
            <Showcntnt
                key={index}
                id={index}
                photo={item.image || "/uploads/placeholder.jpg"}
                title={item.title}
                content={item.content}
                onDelete={()=>deletePost(item._id)}
            />
            ))}
        </div>
        )}
    </div>
    );
}
