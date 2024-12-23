import express , {response} from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// Initialize Express
const app = express();
const PORT = 8000; // Adjust as needed

// MongoDB Connection
mongoose
  .connect(process.env.MongoDb_Connection_string, {
    dbName: process.env.Db_name,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Schemas and Models
const postSchema = new mongoose.Schema({
  email: String,
  title: String,
  content: String,
  image: String,
});
const Post = mongoose.model("posts", postSchema);

const offerSchema = new mongoose.Schema({
  email: String,
  title: String,
});
const Offer = mongoose.model("offers", offerSchema);

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const getBaseURL = () => {
  return process.env.NODE_ENV === "production"
    ? "https://wyldlyf-orginal.onrender.com"
    : `http://localhost:${PORT}`;
};

// Middleware
app.use(cors({ origin: "https://wyldlyf-orginal.onrender.com", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "dist")));
} else {
  app.get("/", (req, res) => {
    res.send("Backend running locally. Use React dev server for frontend.");
  });
}

// Google Generative AI Setup
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Utility Functions for Google Generative AI
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType
    },
  };
}

function generateImageHash(imagePath) {
    return new Promise((resolve, reject) => {
      imageHash.hash(imagePath, 16, true, (error, hash) => {
        if (error) {
          reject(error);
        } else {
          resolve(hash);
        }
      });
    });
  }
  
  function isDuplicateUpload(userId, newImageHash) {
    if (!userUploads[userId]) {
      return false;
    }
    const previousUploads = userUploads[userId];
  return previousUploads.some(upload => upload.imageHash === newImageHash);
}

// Google Generative AI Endpoint


app.post("/upload", upload.single("file"), async (req, res) => {
    const filePath = req.file.path; // Path to uploaded file
    const mimeType = req.file.mimetype; // MIME type of uploaded file
      // Create a Generative Part for the file
    const filePart = fileToGenerativePart(filePath, mimeType);

       try{
      
              const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
              const prompt = "Is the sapling grounded? if planted output as YES else No.";
      
              const imageParts = [filePart];
      
              const generatedContent = await model.generateContent([prompt, ...imageParts]);
              fs.unlinkSync(filePath);
              res.json({response: generatedContent.response.text()});
              if(response === "YES"){
                
              }
          }catch(error){
              console.error("error genrating content",error)
              res.status(500).send('error genreating content');
          }
});


// Routes
// Create Post
app.post("/posts", upload.single("image"), async (req, res) => {
  try {
    const { email, title, content } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;
    const newPost = new Post({ email, title, content, image });
    await newPost.save();
    res.status(201).send("Post created successfully");
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send("Error creating post");
  }
});

// Retrieve All Posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(
      posts.map((post) => ({
        ...post._doc,
        image: post.image ? `${getBaseURL()}/${post.image}` : null,
      }))
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Error fetching posts");
  }
});

// Delete Post
app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.status(200).send("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Error deleting post");
  }
});

// Fetch Random Offer
app.get("/rndm-offers", async (req, res) => {
  try {
    const count = await Offer.countDocuments();
    const random = Math.floor(Math.random() * count);
    const offer = await Offer.findOne().skip(random);
    res.status(200).json(offer);
  } catch (error) {
    console.error("Error fetching random offer:", error);
    res.status(500).send("Error fetching random offer");
  }
});

// Get Article by ID
app.get("/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Post.findById(id);
    if (article) {
      res.status(200).json({
        title: article.title,
        content: article.content,
        image: article.image ? `${getBaseURL()}/${article.image}` : null,
      });
    } else {
      res.status(404).send("Article not found");
    }
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).send("Error fetching article");
  }
});

// Get User Details by Email
app.get("/user-details/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const userPosts = await Post.find({ email });
    const userOffers = await Offer.find({ email });
    res.status(200).json({
      posts: userPosts.map((post) => ({
        ...post._doc,
        image: post.image ? `${getBaseURL()}/${post.image}` : null,
      })),
      offers: userOffers,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).send("Error fetching user details");
  }
});



  

// Serve Frontend


app.use(express.static(path.join(__dirname, "user", "wldlyf-user", "public")));
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "user", "wldlyf-user", "public", "index.html"));
});

app.get("/test-upload", (req, res) => {
    fs.readdir(path.join(__dirname, "wyldlyf_orginal", "uploads"), (err, files) => {
        if (err) return res.status(500).send("Error accessing uploads.");
        res.json(files);
    });
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
