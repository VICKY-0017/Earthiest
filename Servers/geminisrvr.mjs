import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from 'dotenv';
import fs from "fs";
import multer from "multer"
import express, { response } from "express"
import cors from "cors"


config();



const app = express();
const port = 5000;
app.use(cors())

const upload = multer({dest:'uploads/'})


const genAI = new GoogleGenerativeAI(process.env.API_KEY);

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
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


app.post('/upload' , upload.single('file'),async (req,res)=>{

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;


    const filePart = fileToGenerativePart(filePath,mimeType);

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
})

app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}`);
})






// // Turn images to Part objects
// const filePart1 = fileToGenerativePart("download.jpeg", "image/jpeg")
// // const filePart2 = fileToGenerativePart("piranha.jpg", "image/jpeg")
// // const filePart3 = fileToGenerativePart("firefighter.jpg", "image/jpeg")

// async function run() {
//   // Choose a Gemini model.
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

//   const prompt = "Is the sapling is grounded?";

//   const imageParts = [
//     filePart1,
//     // filePart2,
//     // filePart3,
//   ];

//   const generatedContent = await model.generateContent([prompt, ...imageParts]);
  
//   console.log(generatedContent.response.text());
// }

// run();