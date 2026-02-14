const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration.",
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`,
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  let nav = await utilities.getNav();
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 },
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}
async function buildManagement(req, res) {
  let nav = await utilities.getNav();
  res.render("account/loginView", {
    title: "Account Management",
    nav,
  });
}
async function accountLogout(req, res) {
  res.clearCookie("jwt");
  res.redirect("/");
}
// Route to display the edit account information view
async function buildEditAccount(req, res) {
  let nav = await utilities.getNav();
  let accountData = res.locals.accountData;
  res.render("account/editAccount", {
    title: "Edit Account",
    nav,
    accountData,
  });
}
// Route to process the edit account information
async function editAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } = req.body;
  const regResult = await accountModel.editAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  );
  if (regResult) {
    const updatedAccountData = await accountModel.getAccountByEmail(account_email);
    delete updatedAccountData.account_password;
    const accessToken = jwt.sign( updatedAccountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      });
    }
    req.flash("notice", "Account information updated successfully.");
    res.status(201).render("account/loginView", {
      title: "Account Management",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/editAccount", {
      title: "Edit Account",
      nav,
      accountData: {
        account_firstname,
        account_lastname,
        account_email,
      },
    });
  }
};
// Route to process the edit password account information
async function editPassword(req, res) {
  let nav = await utilities.getNav();
  const { account_password, account_id } = req.body;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
    const regResult = await accountModel.editPassword(
      account_id,
      hashedPassword,
    );
    if (regResult) {
      req.flash("notice", "Password updated successfully.");
      res.status(201).render("account/loginView", {
        title: "Account Management",
        nav,
      });
    } else {
      req.flash("notice", "Sorry, the password update failed.");
      res.status(501).render("account/editAccount", {
        title: "Edit Account",
        nav,
        accountData: {
          account_id,
          account_password,
        },
      });
    }
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the password update.",
    );
    res.status(500).render("account/editAccount", {
      title: "Edit Account",
      nav,
      accountData: {
        account_id,
        account_password,
      },
    });
  }};
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagement,
  accountLogout,
  buildEditAccount,
  editAccount,
  editPassword,
};
