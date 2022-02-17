const Order = require("../models/order");
const Product = require("../models/product");
const mongoose = require("mongoose");

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name price") //will populate with the product name ,second args will decide other properties to display , if 2nd args not given every property related to that is diplayed
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        Orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
        message_2: "somthing went wrong",
      });
    });
};

exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        res.status(404).json({
          message: "product not found",
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .catch((err) => {
      res.status(500).json({
        message: "Product not found",
        error: err,
      });
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        requests: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id,
        },
      });
    });
};

exports.orders_get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product", "name price")
    .exec()
    .then((order) => {
      if (!order) {
        res.status(404).json({
          message: "no order found with",
        });
      }
      res.status(200).json({
        order: order,
        requests: {
          type: "GET",
          url: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: "order not found",
      });
    });
};

exports.orders_delete_order = (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Orders deleted",
        orderId: req.params.orderId,
        result: result,
        request: {
          type: "POST",
          url: "http://localhost:3000/orders",
          body: {
            productId: "ID",
            quantity: "Number",
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
