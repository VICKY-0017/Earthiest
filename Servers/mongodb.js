import express from "express";
import mongoose from "mongoose";
import multer from 'multer';
import path from "path";
import dotenv from "dotenv";
import { title } from "process";
import '../dbtest.js';
import cors from "cors";
import { error } from "console";

dotenv.config();

const app = express();
const port = 8000;




mongoose.connect(process.env.MongoDb_Connection_string,{
ssl: true,
});

const postSchema = new mongoose.Schema({
    email:String,
    title:String,
    content:String,
    image:String
});

const Post = mongoose.model('posts',postSchema);



const offerSchema = new mongoose.Schema({
    email:String,
    title: String,
});



const Offer = mongoose.model('offers', offerSchema);

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'../uploads');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname));
    }
})

const upload = multer({storage:storage});


app.use('/uploads',express.static('../uploads'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use('/uploads', express.static('uploads'));


app.post('/posts',upload.single('image'),async(req,res)=>{
    try{
        console.log(req.file);
        const{email,title,content} = req.body;
        const image = req.file ? `uploads/${req.file.filename}` : null;


        const newPost = new Post({email,title,content,image});
        await newPost.save();
        res.status(201).send('Post created sucessfully');

        
    }catch(error){
        res.status(500).send('Error creating post');
        console.error('Error creating post:', error);
    }
});

app.get('/posts', async (req, res) => {
    try {
    const posts = await Post.find();
    res.status(200).json(posts.map(post=>({
        ...post._doc,
        image: post.image ? `http://localhost:8000/${post.image}` : null
    })));
    } catch (error) {
    res.status(500).send('Error fetching posts');
    console.error('Error fetching posts:', error);
    }
});

app.delete('/posts/:id' , async(req,res)=>{
    try{
        const{id} = req.params;
        await Post.findByIdAndDelete(id);
        res.status(200).send('Post deleted sucessfully');
    }catch(err){
        res.status(500).send('error deleting post');
        console.log('error deleting post',error);
    }
});

app.get("/rndm-offers" , async(req,res)=>{
    try{
        const count = await Offer.countDocuments();
        const random = Math.floor(Math.random()*count);
        const offer = await Offer.findOne().skip(random);
        res.json(offer);
    }catch(err){
        res.status(500).send('Error fetching offer');
    }
})


app.get('/articles/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const article = await Post.findById(id);
      if (article) {
        res.status(200).json({
          title: article.title,
          content: article.content,
          image: article.image ? `http://localhost:8000/${article.image}` : null
        });
      } else {
        res.status(404).send('Article not found');
      }
    } catch (error) {
      res.status(500).send('Error fetching article');
      console.error('Error fetching article:', error);
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
                image: post.image ? `http://localhost:8000/${post.image}` : null
            })),
            offers: userOffers
        });
    } catch (error) {
        res.status(500).send('Error fetching user details');
        console.error('Error fetching user details:', error);
    }
});






app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`)
})

