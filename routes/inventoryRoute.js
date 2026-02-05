// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build vehicle details
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInventoryId))
// Route to inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView))
//Route to add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView))
// Route to add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView))
//Process to add classification
router.post("/add-classification",
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification))   
//Process to add inventory
router.post("/add-inventory",
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory))
module.exports = router;