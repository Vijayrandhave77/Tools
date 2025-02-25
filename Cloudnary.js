const express  = require('express')
const app = express()
const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({extended:true}))
const multer  = require('multer')
const path = require("path");

const cloudinary = require('cloudinary').v2



cloudinary.config({ 
  cloud_name: 'dvwq0t2gx', 
  api_key: '795919169491646', 
  api_secret: 'NoP2c4A6q3o5hrrRTOeJwjNxzo0' 
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads')
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`)
//   }
// })

const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
  

app.get("/",(req,res)=>{
    res.sendFile("D:/Programming/WEB DEVELOPMENT/BACKEND/nodejs learn/multer-clodnery/index.html")
})


// app.post("/send",upload.single("file1"),async(req,res)=>{
  
//    const x = await cloudinary.uploader.upload(req.file.path)
//    console.log(x.url)
  
//    res.redirect("/")
// })


app.post("/send", upload.array("avatar", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const fileUploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {

        const originalName = path.parse(file.originalname).name; 
        const modifiedFilename = `custom-${Date.now()}-${originalName}`;
       
        if (!file.buffer || file.size === 0) {
          return reject({ message: "Empty file", http_code: 400 });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "uploads", resource_type: "auto" , public_id: modifiedFilename},
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        uploadStream.end(file.buffer);
      });
    });

    const uploadedFiles = await Promise.all(fileUploadPromises);
    res.json({ message: "Files uploaded successfully", files: uploadedFiles });
    console.log(uploadedFiles)
  } catch (error) {
    console.error("Error in file upload:", error);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
});





app.listen(3000,()=>{
    console.log("server is listening on port 3000")
})    