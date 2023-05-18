const express = require("express");
const { registerUser, addProduct, userLogin, updateProduct, deleteProduct, orderProduct } = require("../controller/userController");
const { userProtect } = require("../middleware/authMiddleware");
const multer = require("../utility/multer");
const router = express.Router();



router.route("/register").post(registerUser);
router.route("/login").post(userLogin);
router
  .route("/addproduct")
  .post(userProtect, multer.upload.array("pImages"), addProduct);
router
  .route("/updateproduct/:id")
  .patch(userProtect, multer.upload.array("pImages"), updateProduct);
router
  .route("/deleteproduct/:id")
  .delete(userProtect, deleteProduct);
router.route("/orderproduct/:id").get(userProtect, orderProduct);

// router.get("/addproduct", loadAddProduct);









module.exports = router;
