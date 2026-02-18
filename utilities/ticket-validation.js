const utilities = require("../utilities/");
const { body, validationResult } = require("express-validator");
const ticketModel = require("../models/ticket-model");
const validate = {};

validate.newTicketRules = () => {
    return [
        body("subject")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a subject for your ticket."), // on error this message is sent.
        body("description")
        .trim()
        .escape()];
};

validate.checkNewTicketData = async (req, res, next) => {
    const { ticket_subject, ticket_description, account_id } = req.body;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        const form =  await utilities.formNewTicket(account_id);
        res.render("ticket/help-center", {
          title: "Help Center",
          nav,
            form,
            errors,
            ticket_subject,
            ticket_description,
            classification_id
        });
        return;
    }
    next();
};

module.exports = validate;