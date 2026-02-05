const utilities = require("../utilities/");
const invModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");
const reg = {};

reg.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage(
        "Please provide a classification name that is at least 2 characters long.",
      ),
  ];
};
reg.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      classification_name,
      errors: null,
    });
  }
  next();
};
reg.inventoryRules = () => {
  return [
    body("make")
      .trim()
      .notEmpty()
      .withMessage("The field 'Make' is requiered."),

    body("model")
      .trim()
      .notEmpty()
      .withMessage("The field 'Model' is requiered."),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("The field 'Description' is requiered."),

    body("image_path")
      .trim()
      .notEmpty()
      .withMessage("The field 'Image Path' is requiered."),

    body("image_thumb")
      .trim()
      .notEmpty()
      .withMessage("The field 'Image Thumb' is requiered."),

    body("price")
      .isFloat({ gt: 0 })
      .withMessage(
        "he field 'Price Thumb' is requiered and should be more than 0.",
      ),

    body("year").notEmpty().withMessage("EThe field 'Year' is requiered."),

    body("miles")
      .isInt({ min: 0 })
      .withMessage("The field 'Miles' is requiered."),

    body("color")
      .trim()
      .notEmpty()
      .withMessage("The field 'Color' is requiered."),
  ];
};
reg.checkInventoryData = async (req, res, next) => {
  const {
    make,
    model,
    description,
    image_path,
    image_thumb,
    price,
    year,
    miles,
    color,
  } = req.body;
  const errors = validationResult(req);
  let select = await utilities.buildClassificationList();
  let nav = await utilities.getNav();
  if (!errors.isEmpty()) {
    return res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: null,
      make,
      model,
      description,
      image_path,
      image_thumb,
      price,
      year,
      miles,
      color,
      select,
    });
  }
  next();
};
module.exports = reg;
