const pool = require("../database/");

// Create ticket
async function createTicket(subject, description, account_id) {
  try {
    const sql =
      "INSERT INTO public.support_ticket (account_id, subject, description, status) VALUES ($1, $2, $3, $4) RETURNING *";
    const result = await pool.query(sql, [
      account_id,
      subject,
      description,
      "open",
    ]);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
};

/* *****************************
 *   Get tickets by user id
 * *************************** */
async function getTickets() {
  try {
    const result = await pool.query(
      "SELECT * FROM public.support_ticket",
    );
    return result.rows;
  } catch (error) {
    return error.message;
  }
};

async function getTicketById(ticketId) {
  try {
    const result = await pool.query(
      "SELECT st.ticket_id, st.account_id, st.subject, st.description, st.status, a.account_firstname, a.account_lastname FROM public.support_ticket st JOIN public.account a ON st.account_id = a.account_id WHERE st.ticket_id = $1",
      [ticketId],
    );
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
};

async function updateTicketStatus(ticketId, newStatus) {
  try {
    const sql = "UPDATE public.support_ticket SET status = $1 WHERE ticket_id = $2 RETURNING *";
    const result = await pool.query(sql, [newStatus, ticketId]);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
};

// Get tickets by user id
async function getTicketsByUserId(accountId) {
  try {
    const result = await pool.query(
      "SELECT * FROM public.support_ticket WHERE account_id = $1",
      [accountId],
    );
    return result.rows;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  getTicketsByUserId,
};
