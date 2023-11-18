const express = require("express");
const { createProduct, getProducts } = require("../controllers/product");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

router.post("/create", upload.single("photo"), async (req, res) => {
  try {
    const { productName, productPrice } = req.body;
    const { filename } = req.file;
    console.log(productName, productPrice, filename);
    if (productName && productPrice && filename) {
      const p = await createProduct({
        productName,
        productPrice,
        file: filename,
      });

      if (p) {
        res.status(200).send("Product created successfully");
      } else if (p === "Server busy") {
        res.status(200).send("Server Busy");
      } else {
        res.status(200).send("Invalid Data");
      }
    }else{
       return res.status(401).send("Please enter valid image (png , Jpg, jpeg)"); 
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/get", async (req, res) => {
  try {
    const products = await getProducts();
    console.log(products);
    return res.status(200).send(products);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
