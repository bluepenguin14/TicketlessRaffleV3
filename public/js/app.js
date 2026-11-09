/* Public raffle entry page */
const raffleForm = document.getElementById("raffleForm");
const message = document.getElementById("message");
const entrantCount = document.getElementById("entrantCount");
const totalTickets = document.getElementById("totalTickets");
const quantityInputs = {
  1: document.getElementById("qty1"),
  5: document.getElementById("qty5"),
  10: document.getElementById("qty10")
};
const orderSummary = document.getElementById("orderSummary");

function selectedPackages() {
  return Object.fromEntries(Object.entries(quantityInputs).map(([price, input]) => [price, Number(input.value || 0)]));
}
function updateOrderSummary() {
  const quantities = selectedPackages();
  const dollars = quantities[1] + quantities[5] * 5 + quantities[10] * 10;
  const tickets = quantities[1] + quantities[5] * 6 + quantities[10] * 20;
  orderSummary.textContent = `Total: $${dollars.toFixed(2)} for ${tickets} ticket(s)`;
  return { quantities, dollars, tickets };
}
Object.values(quantityInputs).forEach(input => input.addEventListener("input", updateOrderSummary));

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
  const { quantities, tickets } = updateOrderSummary();
  if (!tickets) { message.textContent = "Please choose at least one ticket package."; return; }
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
        packageQuantities: quantities
      })
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.error || "Unable to enter the raffle.");
    const dollars = Number(result.entrant.amountPaidCents || 0) / 100;
    message.textContent = `Thank you! You are entered with ${result.entrant.tickets} ticket(s). Amount recorded: $${dollars.toFixed(2)}.`;
    raffleForm.reset();
    quantityInputs[1].value = "0";
    quantityInputs[5].value = "0";
    quantityInputs[10].value = "0";
    updateOrderSummary();
    await loadPublicStats();
  } catch (error) {
    message.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});
updateOrderSummary();
loadPublicStats();
