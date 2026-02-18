const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildVehicleDetails = async (data) => {
  let p;
  if (data.length > 0) {
    const vehicle = data[0];
    p = `<section class="vehicle-details">
          <img src= "${vehicle.inv_image}"/>
          <ul>
            <li><strong>${vehicle.inv_make} ${vehicle.inv_model} Details</strong></li>
            <li><strong>Price: ${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</strong></li>
            <li><strong>Description:</strong> ${vehicle.inv_description}</li>
            <li><strong>Color:</strong> ${vehicle.inv_color}</li>
            <li><strong>Miles:</strong> ${vehicle.inv_miles.toLocaleString("en-US")}</li>
          </ul>
        </section>`;
  } else {
    p = `<p class="notice">Sorry, no matching vehicles could be found.</p>`;
  }
  return p;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

//Form add new inventory
Util.formNewInventory = async function (select) {
  let form = `
        <p class="hint"><strong>FIELD IS REQUIRED.</strong></p>

        <label for="classification_name">Classification</label>
        ${select}
            <label>Make <input type="text" name="make" required></label>
            <label>Model <input type="text" name="model" required></label>
            <label>Description <textarea name="description" required></textarea></label>
            <label>Image Path <input type="text" name="image_path" required></label>
            <label>Image Thumbnail <input type="text" name="image_thumb" required></label>
            <label>Price <input type="number" name="price" required></label>
            <label>Year <input type="number" min="1800" max="2100" name="year" required></label>
            <label>Miles <input type="number" name="miles" required></label>
            <label>Color <input type="text" name="color" required></label>
`;
  return form;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      },
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};
Util.selectClassification = async function () {
  let classification = await invModel.getClassifications();
  let classificationSelect =
    '<select name="classification_id" id="classificationList" required>';
  classificationSelect += "<option value=''>Choose a Classification</option>";
  classification.rows.forEach((row) => {
    classificationSelect +=
      '<option value="' +
      row.classification_id +
      '">' +
      row.classification_name +
      "</option>";
  });
  classificationSelect += "</select>";
  return classificationSelect;
};
//For update inventory form
Util.editInventoryForm = async function (classificationSelect, data) {
  let form = `
        <p class="hint"><strong>FIELD IS REQUIRED.</strong></p>

        <label for="classification_name">Classification</label>
        ${classificationSelect}
            <label>Make <input type="text" name="make" value="${data.inv_make}" required></label>
            <label>Model <input type="text" name="model" value="${data.inv_model}" required></label>
            <label>Description <textarea name="description" required>${data.inv_description}</textarea></label>
            <label>Image Path <input type="text" name="image_path" value="${data.inv_image}" required></label>
            <label>Image Thumbnail <input type="text" name="image_thumb" value="${data.inv_thumbnail}" required></label>
            <label>Price <input type="number" name="price" value="${data.inv_price}" required></label>
            <label>Year <input type="number" min="1800" max="2100" name="year" value="${data.inv_year}" required></label>
            <label>Miles <input type="number" name="miles" value="${data.inv_miles}" required></label>
            <label>Color <input type="text" name="color" value="${data.inv_color}" required></label>
            <input type="hidden" name="inv_id" value="${data.inv_id}" hidden>
`;
  return form;
};
// Middleware to check the type of account and restrict access to certain pages
Util.checkAccountType = (req, res, next) => {
  if (
    res.locals.accountData &&
    (res.locals.accountData.account_type === "Admin" ||
      res.locals.accountData.account_type === "Employee")
  ) {
    next();
  } else {
    req.flash("notice", "You do not have permission to access this page.");
    return res.redirect("/account/login");
  }
};
Util.checkClientAccountType = (req, res, next) => {
  if (
    res.locals.accountData &&
    res.locals.accountData.account_type === "Client"
  ) {
    next();
  } else {
    req.flash("notice", "You do not have permission to access this page.");
    return res.redirect("/account/login");
  }
};

//Ticket form
Util.formNewTicket = async function (user_id) {
  let form = `
            <input type="hidden" name="account_id" value="${user_id}" hidden>
            <label>Subject <input type="text" name="subject" required></label>
            <label>Description <textarea name="description" required></textarea></label>
`;
  return form;
}
module.exports = Util;
