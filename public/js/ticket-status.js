
//Get the new Status buttons
const statusTicket = document.querySelectorAll("button");
statusTicket.forEach((button) => {
  button.addEventListener("click", (event) => {
    const ticketId = event.target.dataset.ticketId;
    const newStatus = event.target.dataset.status;
    window.location.href = `/ticket/update/${ticketId}/${newStatus}`;
    });
});
