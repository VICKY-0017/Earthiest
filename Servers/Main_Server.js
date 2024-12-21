import express from "express";
import mongoose from "mongoose";
import multer from 'multer';
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileURLToPath } from 'url';

// Get the __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;  // Use one port for both MongoDB and AI services

// Configure CORS and body parsing middleware
const corsOptions = {
  origin: 'https://wyldlyf-orginal.onrender.com',  // Allow frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // if you're using cookies/session
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MongoDb_Connection_string, { useNewUrlParser: true, useUnifiedTopology: true, ssl: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if connection fails
  });

// Define schemas and models for posts and offers
const postSchema = new mongoose.Schema({
  email: String,
  title: String,
  content: String,
  image: String,
});

const Post = mongoose.model('Post', postSchema);

const offerSchema = new mongoose.Schema({
  email: String,
  title: String,
});

const Offer = mongoose.model('Offer', offerSchema);

// File Upload Middleware (using multer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// const upload = multer({ storage });
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
});


// app.use('/uploads', express.static('uploads')); // Serve images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Google Generative AI Setup
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType
    },
  };
}

// Endpoint for Generative AI
app.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const mimeType = req.file.mimetype;

  const filePart = fileToGenerativePart(filePath, mimeType);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = "Is the sapling grounded? If planted, output as YES; else NO.";
    const imageParts = [filePart];

    const generatedContent = await model.generateContent([prompt, ...imageParts]);
    fs.unlinkSync(filePath); // Delete the file after processing

    res.json({ response: generatedContent.response.text() });
  } catch (error) {
    console.error("Error generating content", error);
    res.status(500).send('Error generating content');
  }
});

// MongoDB Endpoints

// Create a new post
app.post('/posts', upload.single('image'), async (req, res) => {
  try {
    const { email, title, content } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;


//changed
    if (!email || !title || !content) {
      return res.status(400).send('Missing required fields');
    }

    

    const newPost = new Post({ email, title, content, image });
    await newPost.save();
    res.status(201).send('Post created successfully');
  } catch (error) {
    console.error('Error creating post:', error.message);
    console.error('Stack trace:', error.stack); 
    res.status(500).send('Error creating post');
  }
});

// Get all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`; // Adjust URL for production
    res.status(200).json(posts.map(post => ({
      ...post._doc,
      // image: post.image ? `${baseUrl}/${post.image}` : null
      image: post.image ? `${baseUrl}/uploads/${path.basename(post.image)}` : null,
    })));
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Error fetching posts');
  }
});

// Delete a post
app.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.status(200).send('Post deleted successfully');
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Error deleting post');
  }
});

// Get user details (posts and offers)
app.get('/user-details/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const userPosts = await Post.find({ email });
    const userOffers = await Offer.find({ email });

    const baseUrl = process.env.BASE_URL || `http://localhost:${port}`; // Adjust URL for production
    res.status(200).json({
      posts: userPosts.map(post => ({
        ...post._doc,
        image: post.image ? `${baseUrl}/${post.image}` : null
      })),
      offers: userOffers
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).send('Error fetching user details');
  }
});


app.post('/test-upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.status(200).json({ filename: req.file.filename, path: req.file.path });
});


// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
