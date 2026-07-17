/*
=================================================
 Ticketless Raffle v3

 Storage Service

 Responsibilities:
 - Load raffle data
 - Save raffle data
 - Create missing files automatically
 - Keep file handling in one place

=================================================
*/


const fs = require("fs");
const path = require("path");


// Location of our raffle database

const DATA_FOLDER = path.join(
    __dirname,
    "..",
    "data"
);


const DATA_FILE = path.join(
    DATA_FOLDER,
    "raffles.json"
);


// Default database structure

const DEFAULT_DATA = {

    entries: [],

    winners: []

};



// -----------------------------------------------
// Ensure database exists
// -----------------------------------------------

function ensureDatabase(){

    // Create data folder if missing

    if(!fs.existsSync(DATA_FOLDER)){

        fs.mkdirSync(DATA_FOLDER);

    }


    // Create database file if missing

    if(!fs.existsSync(DATA_FILE)){

        saveData(DEFAULT_DATA);

    }

}



// -----------------------------------------------
// Read raffle data
// -----------------------------------------------

function loadData(){

    ensureDatabase();


    try {

        const raw = fs.readFileSync(
            DATA_FILE,
            "utf8"
        );


        return JSON.parse(raw);


    } catch(error){

        console.error(
            "Database read error:",
            error
        );


        // Recover from corrupted file

        saveData(DEFAULT_DATA);


        return DEFAULT_DATA;

    }

}



// -----------------------------------------------
// Save raffle data
// -----------------------------------------------

function saveData(data){

    ensureDatabase();


    fs.writeFileSync(

        DATA_FILE,

        JSON.stringify(
            data,
            null,
            2
        )

    );

}



// -----------------------------------------------
// Export functions
// -----------------------------------------------

module.exports = {

    loadData,

    saveData

};
