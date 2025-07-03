import express from "express";

import { brainTreePaymentController, braintreeTokenController, createProductController , deleteProductController, deleteProductImageController, getALLProductsController, getProductImagesController, getSingleProductController, productCategoryController, productCountController, productFiltersController, productListController, updateProductController, updateProductImageController } from "../controllers/productController.js";
import { singleUpload } from "../middlewares/multer.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router()

// get-all 
router.get("/get-all", getALLProductsController);

// get by id 
router.get("/get-product/:id", getSingleProductController);

// create 
router.post("/create", singleUpload,  createProductController )

// update Product
// router.put("/update-product/:id", updateProductController);

router.put("/update-product/:id", singleUpload ,updateProductController);


// find Product Image
router.get("/product-images/:id",  singleUpload, getProductImagesController);

//category wise product
router.get('/category-products/:id', productCategoryController);

// update Product Image
router.put("/image/:id",  singleUpload, updateProductImageController);

// delete image 
router.delete("/delete-image/:id", deleteProductImageController );

/// delete product  
router.delete("/delete/:id",  deleteProductController ); 

// product filters
router.post("/product-filters",  productFiltersController ); 


//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);


//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment" , requireSignIn, brainTreePaymentController);

export default router;


