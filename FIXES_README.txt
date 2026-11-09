Ticketless Raffle v3 — Package Quantity & Entrant Edit Fixes

Changes in this update
- Public entry now accepts quantities of each package in one order:
  $1 = 1 ticket, $5 = 6 tickets, $10 = 20 tickets.
  Example: quantity 2 of the $10 package records $20 and 40 tickets.
- Server validates quantities and calculates ticket totals and payment amounts.
- Admin manual entry supports multiple quantities of each package.
- Admin entrant editing now has a visible, centered modal and saves name, email,
  package quantities, total tickets, and amount paid.
- Existing package pricing, weighted drawing, 50/50 money calculations,
  authentication, QR code, and other project files are retained.

Important deployment notes
1. Back up your current project and current raffle data before replacing files.
2. This ZIP intentionally does NOT contain .env, .git, node_modules, or
   data/raffles.json. Keep your existing .env and data/raffles.json unchanged.
3. Extract these files over your existing TicketlessRaffleV3 project folder.
4. In Command Prompt, run: npm install
5. Test locally with: npm start
6. Verify a public order of quantity 2 for the $10 package creates 40 tickets
   and records $20.00. Test editing an entrant in the Admin dashboard.
7. Commit/push the updated files to GitHub to deploy on Render.

Legacy entrants
Older records that have a recorded packagePrice and amountPaidCents will show
that known package when opened for editing. Records without a recorded payment
are not assigned a guessed amount. For those, enter the package quantities only
if you know what was actually paid.
