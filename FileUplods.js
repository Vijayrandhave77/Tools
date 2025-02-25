const express = require("express");
const app = express();
const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({ extended: true }));
const multer = require("multer");
const path = require("path");
const fs = require("fs");
app.use(express.static("./public"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      "D:/Programming/WEB DEVELOPMENT/BACKEND/nodejslearn/Fileuploads/uploads"
    );
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  // res.sendFile("./uploads/index.js")
  // const uploadDirectory = path.join(__dirname, "uploads");
  // fs.readdir(uploadDirectory, (err, files) => {
  //   if (err) {
  //     console.error(err);
  //     res.status(500).send("Error reading the upload directory.");
  //   } else {
  //     res.json({ files });
  //   }
  // });
  res.send("hello");
});

// app.post("/send", upload.single("avatar"), (req, res) => {
//   console.log(req.file);
//   res.send("done");
// });

// uploads multiple file with the same name

app.post("/send", upload.array("avatar",10), (req, res) => {
  // console.log(req.files);
  let file = req.files.forEach((file)=>{
     console.log(file.originalname)
  })

  res.send("done");
});



app.listen(4000, () => {
  console.log("server is listening on port 4000");
});
