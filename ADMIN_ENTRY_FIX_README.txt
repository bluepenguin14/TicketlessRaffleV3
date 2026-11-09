Ticketless Raffle v3 - Admin Entry Fix

This update fixes the Admin page's manual Save Entrant function.

Root cause:
The Admin page sent packageQuantities (the $1, $5 and $10 quantities), but routes/admin.js only passed packagePrice to the raffle service. As a result, the service received no package selection and returned "Choose at least one ticket package."

Changes:
- Admin add route now passes packageQuantities to the raffle service.
- Admin manual-entry form now displays a live order total and ticket count.
- Admin form validates the entrant name and package quantities before submitting.

Install:
1. Stop the local server with Ctrl+C.
2. Extract this ZIP.
3. Copy the contents of TicketlessRaffleV3 into your existing project folder and choose Replace files.
4. Do NOT replace or delete your data folder or .env file.
5. Restart with npm start.
6. Open http://localhost:3000/admin.html and press Ctrl+Shift+R.

The default manual entry quantity remains 1 for the $10 package (20 tickets).
