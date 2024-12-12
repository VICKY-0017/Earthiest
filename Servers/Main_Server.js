import express from "express";
import mongoose from "mongoose";
import multer from 'multer';
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port1 = 5000; // Port for generative AI server
const port2 = 8000; // Port for MongoDB and posts server

// Configure CORS and body parsing middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MongoDb_Connection_string, { ssl: true });

const postSchema = new mongoose.Schema({
    email: String,
    title: String,
    content: String,
    image: String,
});

const Post = mongoose.model('posts', postSchema);

const offerSchema = new mongoose.Schema({
    email: String,
    title: String,
});

const Offer = mongoose.model('offers', offerSchema);

// File Upload Middleware
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));

// Google Generative AI Configuration
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
        },
    };
}

// Generative AI Endpoint
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
app.post('/posts', upload.single('image'), async (req, res) => {
    try {
        const { email, title, content } = req.body;
        const image = req.file ? `uploads/${req.file.filename}` : null;

        const newPost = new Post({ email, title, content, image });
        await newPost.save();
        res.status(201).send('Post created successfully');
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).send('Error creating post');
    }
});

app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts.map(post => ({
            ...post._doc,
            image: post.image ? `http://localhost:${port2}/${post.image}` : null
        })));
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Error fetching posts');
    }
});

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

app.get('/user-details/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const userPosts = await Post.find({ email });
        const userOffers = await Offer.find({ email });

        res.status(200).json({
            posts: userPosts.map(post => ({
                ...post._doc,
                image: post.image ? `http://localhost:${port2}/${post.image}` : null
            })),
            offers: userOffers
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send('Error fetching user details');
    }
});

// Start Both Servers
app.listen(port1, () => {
    console.log(`Generative AI server running at http://localhost:${port1}`);
});

app.listen(port2, () => {
    console.log(`MongoDB and posts server running at http://localhost:${port2}`);
});
