import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OfferProvider() {
  const [content, setContent] = useState({
    photo: "",
    company: "",
    title: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value, files } = event.target;
    if (name === "photo" && files.length > 0) {
      setContent((preVal) => ({ ...preVal, photo: files[0] }));
    } else {
      setContent((prevVal) => ({ ...prevVal, [name]: value }));
    }
  }

  async function submitContent(event) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", content.title);
    formData.append("content", content.content);
    formData.append("company", content.company);
    if (content.photo) {
      formData.append("image", content.photo);
    }

    try {
      const response = await fetch("https://wyldlyf-orginal-bknd.onrender.com/offers", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Post created successfully!");
        setContent({ photo: "", company: "", title: "", content: "" });
        navigate("/"); // Redirect after successful offer creation
      } else {
        const contentType = response.headers.get("Content-Type");
        let responseBody = contentType && contentType.includes("application/json")
          ? await response.json()
          : await response.text();
        alert(`Error creating post: ${responseBody.message || responseBody || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error creating post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Upload Your Offer Details
        </h2>
        <form onSubmit={submitContent} className="space-y-6">
          <div>
            <label className="block font-medium text-gray-400 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              name="photo"
              onChange={handleChange}
              className="w-full px-4 py-3 text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-green-700 file:bg-green-700 file:text-white file:font-semibold hover:file:bg-green-800 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-400 mb-2">
              Brand Name
            </label>
            <input
              type="text"
              name="company"
              value={content.company}
              onChange={handleChange}
              placeholder="Enter brand name"
              className="w-full px-4 py-3 bg-black border border-green-700 text-white placeholder-gray-500 rounded-lg focus:ring focus:ring-green-700 focus:ring-opacity-50 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-400 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={content.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="w-full px-4 py-3 bg-black border border-green-700 text-white placeholder-gray-500 rounded-lg focus:ring focus:ring-green-700 focus:ring-opacity-50 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-400 mb-2">
              Content
            </label>
            <textarea
              name="content"
              value={content.content}
              onChange={handleChange}
              placeholder="Enter your content"
              rows="4"
              className="w-full px-4 py-3 bg-black border border-green-700 text-white placeholder-gray-500 rounded-lg focus:ring focus:ring-green-700 focus:ring-opacity-50 transition-all duration-200"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 focus:ring focus:ring-green-500 focus:ring-offset-2 focus:outline-none transition-all duration-200"
          >
            {loading ? "Uploading Your Offer..." : "Provide Offer"}
          </button>
        </form>

        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-700"></div>
          </div>
        )}
      </div>
    </div>
  );
}
