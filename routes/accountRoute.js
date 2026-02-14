const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/account-validation");

// Route to display the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Route to display the registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister),
);
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount),
);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin),
);
// Route to display the login view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement),
);
// Route to log out the user
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

//Route to edit account information view
router.get("/edit", utilities.checkLogin, utilities.handleErrors(accountController.buildEditAccount));

//Route to process the edit account information
router.post("/edit-information", utilities.checkLogin, regValidate.editRules(), regValidate.checkEditData, utilities.handleErrors(accountController.editAccount));

//Route to process the edit password account information
router.post("/edit-password", utilities.checkLogin, regValidate.passwordRules(), regValidate.checkPasswordData, utilities.handleErrors(accountController.editPassword));
module.exports = router;
