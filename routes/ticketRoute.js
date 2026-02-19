// Needed Resources
const express = require("express");
const router = new express.Router();
const ticketController = require("../controllers/ticketController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/ticket-validation");

//Route to build help center view
router.get(
  "/help-center",
  utilities.checkClientAccountType,
  utilities.handleErrors(ticketController.buildHelpCenter),
);

//Route to create a new ticket
router.post(
  "/create",
  utilities.checkClientAccountType,
  regValidate.newTicketRules(),
  regValidate.checkNewTicketData,
  utilities.handleErrors(ticketController.createTicket),
);

//Route to build ticket inventory view
router.get(
  "/ticket-inventory",
  utilities.checkAccountType,
  utilities.handleErrors(ticketController.buildTicketInventory),
);

// Route to build my tickets view
router.get(
  "/my-tickets",
  utilities.checkClientAccountType,
  utilities.handleErrors(ticketController.buildMyTickets),
);

// Route to update ticket status
router.get(
  "/update/:ticket_id/:status",
  utilities.checkAccountType,
  utilities.handleErrors(ticketController.updateTicketStatus),
);

// See ticket details
router.get(
  "/:ticket_id",
  utilities.checkAccountType,
  utilities.handleErrors(ticketController.buildTicketDetails),
);

module.exports = router;
