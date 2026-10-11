/* Public raffle entry page */
const raffleForm = document.getElementById("raffleForm");
const message = document.getElementById("message");
const entrantCount = document.getElementById("entrantCount");
const totalTickets = document.getElementById("totalTickets");
const packagePrice = document.getElementById("packagePrice");

async function loadPublicStats() {
  try {
    const response = await fetch("/api/stats");
    const result = await response.json();
    if (result.success) {
      entrantCount.textContent = result.stats.entrants;
      totalTickets.textContent = result.stats.totalTickets;
    }
  } catch (error) { console.error("Unable to load raffle stats", error); }
}

raffleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = raffleForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  message.textContent = "Submitting your entry…";
  try {
    const response = await fetch("/api/enter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        packagePrice: Number(packagePrice.value)
      })
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.error || "Unable to enter the raffle.");
    const dollars = Number(result.entrant.amountPaidCents || 0) / 100;
    message.textContent = `Thank you! You are entered with ${result.entrant.tickets} ticket(s). Amount recorded: $${dollars.toFixed(2)}.`;
    raffleForm.reset();
    packagePrice.value = "1";
    await loadPublicStats();
  } catch (error) {
    message.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});
loadPublicStats();
