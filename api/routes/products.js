const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");


const ProductController = require("./../controllers/products");

router.get("/",checkAuth ,ProductController.products_get_all);

router.post("/", checkAuth,ProductController.products_create_product);

router.get("/:productId",checkAuth, ProductController.products_get_product);

router.patch("/:productId",checkAuth, ProductController.products_update_product);

router.delete("/:productId",checkAuth, ProductController.products_delete_product);

module.exports = router;

