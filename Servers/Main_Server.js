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
import { v2 as cloudinary } from 'cloudinary';



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
  company: String,  // Added company field
  title: String,
  content: String,  // Added content field
  image: String,    // Added image URL field
});
const Offer = mongoose.model("offers", offerSchema);

// Multer Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
 });

const getBaseURL = () => {
  return process.env.NODE_ENV === "production"
    ? "https://wyldlyf-orginal.onrender.com"
    : `http://localhost:${PORT}`;
};

// Middleware

const corsOptions = {
  origin: ["http://localhost:3000", "https://wyldlyf-orginal.onrender.com","https://offers-providers.onrender.com"],  // List all allowed origins
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
function fileToGenerativePart(fileBuffer, mimeType) {
  return {
    inlineData: {
      data: fileBuffer.toString("base64"),
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


cloudinary.config({
  cloud_name:'dzemj0l2y',
  secure:true,
  api_key: process.env.CLOUDINARY_API,
  api_secret:process.env.CLOUDINARY_API_SECRET

})

// Google Generative AI Endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
    const fileBuffer = req.file.buffer; // Path to uploaded file
    const mimeType = req.file.mimetype; // MIME type of uploaded file
      // Create a Generative Part for the file
    const filePart = fileToGenerativePart(fileBuffer, mimeType);

       try{
      
              const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
              const prompt = "Is the sapling grounded? if planted output as YES else No.";
      
              const imageParts = [filePart];
      
              const generatedContent = await model.generateContent([prompt, ...imageParts]);
              
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
// app.post("/posts", upload.single("image"), async (req, res) => {
//   try {
//     const { email, title, content } = req.body;
//     const image = req.file ? `uploads/${req.file.filename}` : null;

//     const newPost = new Post({ email, 
//       title, 
//       content, 
//       image:cloudinaryResult.secure_url });

//     await newPost.save();
//     res.status(201).send("Post created successfully");
//   } catch (error) {
//     console.error("Error creating post:", error);
//     res.status(500).send("Error creating post");
//   }
// });

app.post("/posts", upload.single("image"), async (req, res) => {
  try {
    console.log(req.file);
    const { email, title, content } = req.body;
    const imageFile = req.file;

    let imageUrl = null;
    if (imageFile) {
      // Upload the image to Cloudinary
      // cloudinaryResult = await cloudinary.uploader.upload(imageFile.path);
      try {
        // Convert buffer to base64
        const b64 = Buffer.from(imageFile.buffer).toString("base64");
        const dataURI = "data:" + imageFile.mimetype + ";base64," + b64;
        
        // Upload to Cloudinary directly from memory
        const cloudinaryResult = await cloudinary.uploader.upload(dataURI, {
          resource_type: 'auto',
          folder: 'wyldlyf' // Optional: organize uploads in a folder
        });
        
        imageUrl = cloudinaryResult.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).send("Error uploading image");
      }
    }

    const newPost = new Post({
      email,
      title,
      content,
      image: imageUrl 
      // cloudinaryResult ? cloudinaryResult.secure_url : null,
    });

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
        image: post.image ? post.image : null,
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


// Offer Creation Route
app.post("/offers", upload.single("image"), async (req, res) => {
  try {
    const { email, company, title, content } = req.body;
    const imageFile = req.file;

    let imageUrl = null;

    if (imageFile) {
      try {
        const b64 = Buffer.from(imageFile.buffer).toString("base64");
        const dataURI = `data:${imageFile.mimetype};base64,${b64}`;
        
        const cloudinaryResult = await cloudinary.uploader.upload(dataURI, {
          resource_type: 'auto',
          folder: 'offers' // Optional: customize folder name
        });
        
        imageUrl = cloudinaryResult.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).send("Error uploading image");
      }
    }

    const newOffer = new Offer({
      email,
      company,
      title,
      content,
      image: imageUrl
    });

    await newOffer.save();
    res.status(201).send("Offer created successfully");
  } catch (error) {
    console.error("Error creating offer:", error);
    res.status(500).send("Error creating offer");
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


app.get("/test-upload", (req, res) => {
  fs.readdir("./uploads", (err, files) => {
    if (err) return res.status(500).send("Error accessing uploads.");
    res.json(files);
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
