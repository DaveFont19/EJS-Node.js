const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid
    })
}
invCont.buildByInventoryId = async function (req, res, next) {
    const vehicleDetails = req.params.inv_id
    const data = await invModel.getVehicleDetails(vehicleDetails)
    const hero = await utilities.buildVehicleDetails(data)
    let nav = await utilities.getNav()
    res.render("./inventory/vehicleDetails", {
        title: `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`, nav, hero
    })
}
invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: "Inventory Management", nav
    })
}
invCont.buildAddClassificationView = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: "Add New Classification", nav
    })
}
invCont.buildAddInventoryView = async function (req, res, next) {
    let nav = await utilities.getNav()
    let select = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
        title: "Add New Vehicle", nav, select
    })
}
invCont.addClassification = async function (req, res) {
    const { classification_name } = req.body
    const regResult = await invModel.addClassification(classification_name)
    let nav = await utilities.getNav()
    if (regResult) {
        req.flash("notice", `The classification ${classification_name} was added successfully.`)
        res.status(201).render("./inventory/management", {
            title: "Inventory Management", nav
        })
    }  else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav
    });
  }
}
invCont.addInventory = async function (req, res) {
    const { make, model, year, description, image_path, image_thumb, price, miles, color, classification_id } = req.body
    const addVehicle = await invModel.addInventory(make, model, year, description, image_path, image_thumb, price, miles, color, classification_id)
    let nav = await utilities.getNav()
    if (addVehicle) {
        req.flash("notice", `The vehicle ${make} ${model} was added successfully.`)
        res.status(201).render("./inventory/management", {
            title: "Inventory Management", nav
        })
    }  else {
        req.flash("notice", "Sorry, the vehicle addition failed.");
        res.status(501).render("./inventory/add-inventory", {
          title: "Add New Vehicle",
          nav,
          select: await utilities.buildClassificationList()
        });
      }
}
module.exports = invCont;

