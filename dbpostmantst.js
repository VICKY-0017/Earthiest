import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();

dotenv.config();

const Mongo_url = process.env.MongoDb_Connection_string;
const Db_name = "wldlyf"; 

mongoose.connect(Mongo_url, {
  dbName: Db_name,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Post = mongoose.model('posts', new mongoose.Schema({ 
  title: String, 
  content: String,
  image: String
}));

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find(); 
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts', details: err.message });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
