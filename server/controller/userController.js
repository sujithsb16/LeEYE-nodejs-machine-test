const asyncHandler = require("express-async-handler");
const Product = require("../model/productModel");
const cloudinary = require("../utility/cloudinary");
const { generateToken } = require("../utility/generateToken");
const User = require("../model/userModel");



const registerUser = asyncHandler(async (req, res) => {
  const { name, email, mobile, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("user Already Exists");
  }
  const user = await User.create({
    name,
    email,
    mobile,
    password,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  } else {
    res.status(400);
    throw new Error("Error Occured!");
  }
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log(email);

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.firstName,
      name2: user.lastName,
      email: user.email,
      mobile: user.mobile,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password!");
  }
});


const addProduct = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id
    const { name, price, description } = req.body;

        const images = req.files;

       const product = await Product.create({
      name,
      price,
      description,
     images: images.map((x)=>x.filename),
      user: userId,
    });

    if(product){
        res.status(200).json({
          success: true,
          message: "Product Added",
          product
        });

    }

    

  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    console.log(error);
  }
});



const updateProduct = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id
    console.log(req.params);
    const { name, price, description } = req.body;
    let images = req.files;



    console.log(userId);

    const product = await Product.findById({ _id: productId });

    console.log(product);

    if (!product) {
      res.status(400);
      throw new Error("User not found");
    } else if (images.length>0) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.images = images.map((x) => x.filename)
    }else{
         product.name = name || product.name;
         product.price = price || product.price;
         product.description = description || product.description;
    }

    const productData = await product.save();
    if (productData) {
      res.status(201).json({
       message:"product updated",
       productData
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id
    console.log(req.params);
   

    await Product.findByIdAndDelete({ _id: productId });

    
      res.status(204).json({
       message:"product deleted",
      });
   
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

const orderProduct = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

   const productData =  await Product.findById({ _id: productId });

   const tax = (productData.price * 18) / 100;
   const mrp = productData.price + tax;
   const discount = 2;
   const shippingPrice = 100;
   const discountPrice = (mrp * discount) / 100;
   const totalPrice = mrp - discountPrice + shippingPrice;

   const orderProduct = {
     name: productData.name,
     price: totalPrice,
     images: productData.images,
     description: productData.description,
   };

   res.status(200).json({
     message: "order product data",
     orderProduct,
   });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});






module.exports = {
  registerUser,
  addProduct,
  userLogin,
  updateProduct,
  deleteProduct,
  orderProduct,
};