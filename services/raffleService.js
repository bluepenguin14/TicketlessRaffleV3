/*
 Ticketless Raffle v3 - raffle service
 Ticket packages are validated on the server; never trust client-supplied ticket counts.
*/
const { v4: uuid } = require("uuid");
const { loadData, saveData } = require("./storage");
const weightedDraw = require("../utils/weightedDraw");

const PACKAGES = Object.freeze({
  1: { tickets: 1, amountPaidCents: 100 },
  5: { tickets: 6, amountPaidCents: 500 },
  10: { tickets: 20, amountPaidCents: 1000 }
});

function normalizeName(name) { return String(name || "").trim().toLowerCase(); }
function isDuplicate(name, entries) {
  const clean = normalizeName(name);
  return entries.some(entry => normalizeName(entry.name) === clean);
}
function isPreviousWinner(name, winners) {
  const clean = normalizeName(name);
  return winners.some(winner => normalizeName(winner.name) === clean);
}
function centsToDollars(cents) { return Number((cents / 100).toFixed(2)); }
function collectedCents(entries) {
  return entries.reduce((sum, entry) => {
    // Legacy entries without recorded payment are deliberately not guessed.
    return Number.isInteger(entry.amountPaidCents) && entry.amountPaidCents >= 0
      ? sum + entry.amountPaidCents : sum;
  }, 0);
}
function missingPaymentCount(entries) {
  return entries.filter(entry => !Number.isInteger(entry.amountPaidCents) || entry.amountPaidCents < 0).length;
}
function packageFor(packagePrice) {
  const key = Number(packagePrice);
  if (!Object.prototype.hasOwnProperty.call(PACKAGES, key)) {
    throw new Error("Choose a valid package: $1 for 1 ticket, $5 for 6 tickets, or $10 for 20 tickets.");
  }
  return { price: key, ...PACKAGES[key] };
}

function addEntrant({ name, email = "", packagePrice }) {
  if (!String(name || "").trim()) throw new Error("Name is required");
  const selected = packageFor(packagePrice);
  const data = loadData();
  if (isDuplicate(name, data.entries)) throw new Error("Duplicate entrant");
  const entrant = {
    id: uuid(), name: String(name).trim(), email: String(email || "").trim(),
    tickets: selected.tickets, amountPaidCents: selected.amountPaidCents,
    packagePrice: selected.price, timestamp: new Date().toISOString()
  };
  data.entries.push(entrant);
  saveData(data);
  return entrant;
}

function updateEntrantPackage(entrant, packagePrice) {
  const selected = packageFor(packagePrice);
  entrant.tickets = selected.tickets;
  entrant.amountPaidCents = selected.amountPaidCents;
  entrant.packagePrice = selected.price;
  return entrant;
}
function getEntries() { return loadData().entries; }
function getStats() {
  const data = loadData();
  const totalTickets = data.entries.reduce((sum, entry) => sum + Number(entry.tickets || 0), 0);
  const totalCollectedCents = collectedCents(data.entries);
  // Split integer cents so the two shares always add up to the known total.
  const winnerShareCents = Math.floor(totalCollectedCents / 2);
  const organizationShareCents = totalCollectedCents - winnerShareCents;
  return {
    entrants: data.entries.length, totalTickets, winners: data.winners.length,
    totalCollectedCents, totalCollected: centsToDollars(totalCollectedCents),
    winnerShareCents, winnerShare: centsToDollars(winnerShareCents),
    organizationShareCents, organizationShare: centsToDollars(organizationShareCents),
    entriesMissingAmount: missingPaymentCount(data.entries)
  };
}
function drawWinner() {
  const data = loadData();
  if (!data.entries.length) throw new Error("No entrants");
  const eligible = data.entries.filter(entry => !isPreviousWinner(entry.name, data.winners));
  if (!eligible.length) throw new Error("All entrants have already won");
  const winner = weightedDraw(eligible);
  const totalCollectedCents = collectedCents(data.entries);
  const winnerShareCents = Math.floor(totalCollectedCents / 2);
  const organizationShareCents = totalCollectedCents - winnerShareCents;
  const winnerRecord = {
    name: winner.name, tickets: winner.tickets, email: winner.email,
    date: new Date().toISOString(), totalCollectedCents,
    winnerShareCents, organizationShareCents,
    totalCollected: centsToDollars(totalCollectedCents),
    winnerShare: centsToDollars(winnerShareCents),
    organizationShare: centsToDollars(organizationShareCents)
  };
  data.winners.push(winnerRecord);
  saveData(data);
  return winnerRecord;
}
function getWinners() { return loadData().winners; }
function resetRaffle() { const data = { entries: [], winners: [] }; saveData(data); return data; }
module.exports = { addEntrant, updateEntrantPackage, getEntries, getStats, drawWinner, getWinners, resetRaffle, PACKAGES };
