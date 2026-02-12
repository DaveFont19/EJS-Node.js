const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

// Build vehicle details view
invCont.buildByInventoryId = async function (req, res, next) {
  const vehicleDetails = req.params.inv_id;
  const data = await invModel.getVehicleDetails(vehicleDetails);
  const hero = await utilities.buildVehicleDetails(data);
  let nav = await utilities.getNav();
  res.render("./inventory/vehicleDetails", {
    title: `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`,
    nav,
    hero,
  });
};

// Build inventory management view
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationSelect = await utilities.selectClassification();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
  });
};

// Build add classification view
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    classificationSelect,
  });
};
invCont.buildAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationSelect = await utilities.buildClassificationList();
  let form = await utilities.formNewInventory(classificationSelect);
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    form,
  });
};

//Process to add classification
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const regResult = await invModel.addClassification(classification_name);
  let nav = await utilities.getNav();
  if (regResult) {
    req.flash(
      "notice",
      `The classification ${classification_name} was added successfully.`,
    );
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
    });
  }
};

//Process to add inventory
invCont.addInventory = async function (req, res) {
  const {
    make,
    model,
    year,
    description,
    image_path,
    image_thumb,
    price,
    miles,
    color,
    classification_id,
  } = req.body;
  const addVehicle = await invModel.addInventory(
    make,
    model,
    year,
    description,
    image_path,
    image_thumb,
    price,
    miles,
    color,
    classification_id,
  );
  let nav = await utilities.getNav();
  if (addVehicle) {
    req.flash("notice", `The vehicle ${make} ${model} was added successfully.`);
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect: await utilities.selectClassification(),
    });
  } else {
    let classificationSelect = await utilities.buildClassificationList();
    let form = await utilities.formNewInventory(classificationSelect);
    req.flash("notice", "Sorry, the vehicle addition failed.");
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      form,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData =
    await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

invCont.buildEditInventoryView = async function (req, res, next) {
  let inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  let data = await invModel.getVehicleDetails(inv_id);
  let classificationSelect = await utilities.buildClassificationList(
    data[0].classification_id,
  );
  let form = await utilities.editInventoryForm(classificationSelect, data[0]);
  let itemName = `${data[0].inv_make} ${data[0].inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: `Edit ${itemName}`,
    nav,
    form,
    inv_id: data[0].inv_id,
    inv_make: data[0].inv_make,
    inv_model: data[0].inv_model,
    inv_year: data[0].inv_year,
    inv_description: data[0].inv_description,
    inv_image: data[0].inv_image,
    inv_thumbnail: data[0].inv_thumbnail,
    inv_price: data[0].inv_price,
    inv_miles: data[0].inv_miles,
    inv_color: data[0].inv_color,
    classification_id: data[0].classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  const {
    inv_id,
    make,
    model,
    description,
    image_path,
    image_thumb,
    price,
    year,
    miles,
    color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    make,
    model,
    description,
    image_path,
    image_thumb,
    price,
    year,
    miles,
    color,
    classification_id,
  );
  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    let inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    let data = await invModel.getVehicleDetails(inv_id);
    let classificationSelect = await utilities.buildClassificationList(
      data[0].classification_id,
    );
    let form = await utilities.editInventoryForm(classificationSelect, data[0]);
    let itemName = `${data[0].inv_make} ${data[0].inv_model}`;
    res.render("./inventory/edit-inventory", {
      title: itemName,
      nav,
      form,
      dataInv_id: data[0].inv_id,
      inv_make: data[0].inv_make,
      inv_model: data[0].inv_model,
      inv_year: data[0].inv_year,
      inv_description: data[0].inv_description,
      inv_image: data[0].inv_image,
      inv_thumbnail: data[0].inv_thumbnail,
      inv_price: data[0].inv_price,
      inv_miles: data[0].inv_miles,
      inv_color: data[0].inv_color,
      classification_id: data[0].classification_id,
    });
  }
};

//Build delete inventory view
invCont.buildDeleteInventoryView = async function (req, res, next) {
  let inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  let data = await invModel.getVehicleDetails(inv_id);
  res.render("./inventory/delete-confirm", {
    title: `Delete ${data[0].inv_make} ${data[0].inv_model}`,
    nav,
    data: data[0],
    error: null,
  });
};

// Process to delete inventory
invCont.deleteInventory = async function (req, res, next) {
  const { inv_id } = req.body;
  const deleteResult = await invModel.deleteInventory(inv_id);
  if (deleteResult) {
    req.flash("notice", `The vehicle was successfully deleted.`);
    res.redirect("/inv/");
  } else {
    let inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    let data = await invModel.getVehicleDetails(inv_id);
    res.render("./inventory/delete-confirm", {
      title: `Delete ${data[0].inv_make} ${data[0].inv_model}`,
      nav,
      data: data[0],
      error: "Sorry, the vehicle could not be deleted.",
    });
  }

};
module.exports = invCont;
