import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function FullArticle() {
  const { articleId } = useParams(); // Get articleId from the URL
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`https://wyldlyf-orginal-bknd.onrender.com/articles/${articleId}`);
        setArticle(response.data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!article) {
    return <div className="flex items-center justify-center min-h-screen">Article not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4 bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{article.title}</h1>
        <p className="text-gray-600 mb-6">{article.content}</p>
        {article.image && (
          <img
            src={article.image.startsWith("http") ? article.image : `https://wyldlyf-orginal-bknd.onrender.com/${article.image}`}
            alt={article.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
      </div>
    </div>
  );
}
