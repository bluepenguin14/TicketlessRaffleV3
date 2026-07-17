/*
=================================================
 Ticketless Raffle v3

 Raffle Service

 Responsibilities:
 - Add entrants
 - Prevent duplicates
 - Validate tickets
 - Track winners
 - Draw winners
 - Reset raffle
 - Provide statistics

=================================================
*/


const { v4: uuid } = require("uuid");

const {
    loadData,
    saveData
} = require("./storage");

const weightedDraw = require("../utils/weightedDraw");



// -----------------------------------------------
// Clean names for comparison
// -----------------------------------------------

function normalizeName(name){

    return name
        .trim()
        .toLowerCase();

}



// -----------------------------------------------
// Check duplicate entrant
// -----------------------------------------------

function isDuplicate(name, entries){

    const cleanName = normalizeName(name);


    return entries.some(entry =>

        normalizeName(entry.name) === cleanName

    );

}



// -----------------------------------------------
// Check previous winner
// -----------------------------------------------

function isPreviousWinner(name, winners){

    const cleanName = normalizeName(name);


    return winners.some(winner =>

        normalizeName(winner.name) === cleanName

    );

}



// -----------------------------------------------
// Add entrant
// -----------------------------------------------

function addEntrant({

    name,

    tickets = 1,

    email = ""

}){


    if(!name){

        throw new Error(
            "Name is required"
        );

    }


    tickets = Number(tickets);


    if(
        isNaN(tickets) ||
        tickets < 1
    ){

        throw new Error(
            "Tickets must be at least 1"
        );

    }



    const data = loadData();



    if(
        isDuplicate(
            name,
            data.entries
        )
    ){

        throw new Error(
            "Duplicate entrant"
        );

    }



    const entrant = {

        id: uuid(),

        name: name.trim(),

        email: email.trim(),

        tickets,

        timestamp:
            new Date().toISOString()

    };



    data.entries.push(
        entrant
    );


    saveData(data);



    return entrant;

}



// -----------------------------------------------
// Get all entrants
// -----------------------------------------------

function getEntries(){

    const data = loadData();

    return data.entries;

}



// -----------------------------------------------
// Get raffle statistics
// -----------------------------------------------

function getStats(){

    const data = loadData();


    const totalTickets =
        data.entries.reduce(

            (sum,entry)=>
                sum + entry.tickets,

            0

        );


    return {

        entrants:
            data.entries.length,

        totalTickets,

        winners:
            data.winners.length

    };

}



// -----------------------------------------------
// Draw winner
// -----------------------------------------------

function drawWinner(){


    const data = loadData();



    if(data.entries.length === 0){

        throw new Error(
            "No entrants"
        );

    }



    // Remove previous winners

    const eligible =
        data.entries.filter(entry =>

            !isPreviousWinner(
                entry.name,
                data.winners
            )

        );



    if(eligible.length === 0){

        throw new Error(
            "All entrants have already won"
        );

    }



    const winner =
        weightedDraw(
            eligible
        );



    const winnerRecord = {

        name:
            winner.name,

        tickets:
            winner.tickets,

        email:
            winner.email,

        date:
            new Date().toISOString()

    };



    data.winners.push(
        winnerRecord
    );


    saveData(data);



    return winnerRecord;

}



// -----------------------------------------------
// Winner history
// -----------------------------------------------

function getWinners(){

    const data = loadData();

    return data.winners;

}



// -----------------------------------------------
// Reset raffle
// -----------------------------------------------

function resetRaffle(){


    const data = {

        entries: [],

        winners: []

    };


    saveData(data);


    return data;

}




module.exports = {

    addEntrant,

    getEntries,

    getStats,

    drawWinner,

    getWinners,

    resetRaffle

};
