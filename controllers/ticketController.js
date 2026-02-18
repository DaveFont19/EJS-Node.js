const utilities = require("../utilities");
const ticketModel = require("../models/ticket-model");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/****************************************
 *  Deliver help center view
 * *************************************** */
async function buildHelpCenter(req, res, next) {
  let nav = await utilities.getNav();
  const userId = res.locals.accountData.account_id;
  const form = await utilities.formNewTicket(userId);
  res.render("ticket/help-center", {
    title: "Help Center",
    nav,
    form,
  });
}

// Create a new ticket
async function createTicket(req, res, next) {
  const { subject, description, account_id } = req.body;
  const result = await ticketModel.createTicket(
    subject,
    description,
    account_id,
  );
  if (result) {
    req.flash("notice", "Ticket created successfully.");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Failed to create ticket.");
    res.redirect("/ticket/help-center");
  }
};

// Deliver ticket inventory view
async function buildTicketInventory(req, res, next) {
  let nav = await utilities.getNav();
  const tickets = await ticketModel.getTickets();
  res.render("ticket/ticket-display", {
    title: "Ticket Inventory",
    nav,
    tickets,
  });
};

// Deliver ticket details view
async function buildTicketDetails(req, res, next) {
  let nav = await utilities.getNav();
  const ticketId = req.params.ticketId;
  const ticket = await ticketModel.getTicketById(ticketId);
  res.render("ticket/ticket-details", {
    title: "Ticket Details",
    nav,
    ticket,
  });
}

module.exports = {
  buildHelpCenter,
  createTicket,
  buildTicketInventory,
  buildTicketDetails,
};
