/*
=================================================
 Ticketless Raffle v3

 Admin Dashboard JavaScript

 Responsibilities:
 - Load raffle stats
 - Add manual entrants
 - Draw winners
 - Export CSV
 - Reset raffle

=================================================
*/


// -----------------------------------------------
// Elements
// -----------------------------------------------

const loginSection =
    document.getElementById("loginSection");


const dashboardSection =
    document.getElementById("dashboardSection");


const loginButton =
    document.getElementById("loginButton");


const adminPassword =
    document.getElementById("adminPassword");


const loginMessage =
    document.getElementById("loginMessage");

const entrantCount =
    document.getElementById("entrantCount");


const totalTickets =
    document.getElementById("totalTickets");


const winnerCount =
    document.getElementById("winnerCount");


const winnerDisplay =
    document.getElementById("winnerDisplay");


const winnerHistory =
    document.getElementById("winnerHistory");


const message =
    document.getElementById("adminMessage");


const searchEntrants =
    document.getElementById("searchEntrants");


let allEntrants = [];

loginButton.addEventListener(
"click",

async()=>{


    const response =
    await fetch(
        "/api/auth/login",
        {

            method:"POST",

            credentials:"include",

            headers:{

                "Content-Type":
                "application/json"

            },

            body:
            JSON.stringify({

                password:
                adminPassword.value

            })

        }
    );


    const result =
        await response.json();



    if(result.success){


        loginSection.style.display =
            "none";


        dashboardSection.style.display =
            "block";


        loadDashboard();


    }
    else {


        loginMessage.textContent =
            "Invalid password";


    }


});


// -----------------------------------------------
// Load Dashboard
// -----------------------------------------------

async function loadDashboard(){


    try {


        const response = await fetch(
    "/api/admin/stats",
    {
        credentials: "include"
    }
);


        const result =
            await response.json();



        if(result.success){


            entrantCount.textContent =
                result.stats.entrants;


            totalTickets.textContent =
                result.stats.totalTickets;


            winnerCount.textContent =
                result.stats.winners;



            displayWinners(
                result.winnerHistory
            );

            loadEntrants();

        }


    }
    catch(error){

        console.error(error);

    }


}


// -----------------------------------------------
// Load Entrants
// -----------------------------------------------

// -----------------------------------------------
// Load Entrants
// -----------------------------------------------

async function loadEntrants() {

    try {

        const response = await fetch(
            "/api/admin/entrants",
            {
                credentials: "include"
            }
        );

        const result = await response.json();

        if (!result.success) {

            return;

        }

        // Save all entrants for searching/sorting
        allEntrants = result.entrants;

        // Display them
        renderEntrants(allEntrants);

    }

    catch (error) {

        console.error(error);

    }

}



// -----------------------------------------------
// Add Entrant
// -----------------------------------------------

document
.getElementById("saveEntrantButton")
.addEventListener(
"click",

async()=>{


    const name =
        document
        .getElementById("adminName")
        .value;


    const email =
        document
        .getElementById("adminEmail")
        .value;


    const tickets =
        Number(
            document
            .getElementById("adminTickets")
            .value
        );



    try {


     const response =
         await fetch(
        "/api/admin/add",
        {
            method:"POST",

            credentials:"include",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                name,

                email,

                tickets

            })
        }
    );



        const result =
            await response.json();



        message.textContent =
            result.success
            ?
            "Entrant added successfully."
            :
            result.error;


        if(result.success){

    loadDashboard();

    loadEntrants();

    // Clear manual entrant form
    document
    .getElementById("adminName")
    .value = "";

    document
    .getElementById("adminEmail")
    .value = "";

    document
    .getElementById("adminTickets")
    .value = "1";

}
        




    }

    catch(error){

        console.error(error);

    }


});








// -----------------------------------------------
// Draw Winner
// -----------------------------------------------

document
.getElementById("drawButton")
.addEventListener(
"click",

async()=>{


    if(
        !confirm(
        "Draw a winner now?"
        )
    ){

        return;

    }




    const response =
      await fetch(
        "/api/admin/draw",
        {
            method:"POST",

            credentials:"include"
        }
    );



    const result =
        await response.json();




    if(result.success){


        winnerDisplay.innerHTML =

        `
        <h2>
        ${result.winner.name}
        </h2>

        <p>
        Winning Entries:
        ${result.winner.tickets}
        </p>
        `;



        loadDashboard();


    }

    else {


        winnerDisplay.textContent =
            result.error;


    }



});








// -----------------------------------------------
// Export CSV
// -----------------------------------------------

document
.getElementById("exportButton")
.addEventListener(
"click",

()=>{

   window.location.href =
        "/api/admin/export";
   

});



// -----------------------------------------------
// Reset Raffle
// -----------------------------------------------

document
.getElementById("resetButton")
.addEventListener(
"click",

async()=>{

    if(
        !confirm(
        "Reset this raffle? All entries will be removed."
        )
    ){

        return;

    }


    const response =
    await fetch(
        "/api/admin/reset",
        {
            method:"POST",

            credentials:"include"
        }
    );



    const result =
        await response.json();



    if(result.success){


        alert(
            "Raffle reset complete."
        );


        loadDashboard();

        loadEntrants();

    }

// Refresh everything

// Clear manual entry form
const form = document.getElementById("addEntrantForm");

if (form) {
    form.reset();
}

});




// -----------------------------------------------
// Render Entrants
// -----------------------------------------------

function renderEntrants(entrants) {

    const tableBody =
        document.getElementById("entrantTableBody");

    tableBody.innerHTML = "";

    entrants.forEach(entrant => {

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${entrant.name}</td>

            <td>${entrant.email || ""}</td>

            <td>${entrant.tickets}</td>

            <td>${new Date(
                entrant.timestamp
            ).toLocaleString()}</td>

            <td>

                <button
                    class="editButton"
                    data-id="${entrant.id}">
                    ✏️
                </button>

            </td>

            <td>

                <button
                    class="deleteButton"
                    data-id="${entrant.id}">
                    🗑
                </button>

            </td>

        `;

        tableBody.appendChild(row);

    });

}


// -----------------------------------------------
// Search Entrants
// -----------------------------------------------

function filterEntrants() {

    const search =
        searchEntrants.value
        .toLowerCase()
        .trim();

    const filtered =
        allEntrants.filter(entrant =>

            entrant.name
                .toLowerCase()
                .includes(search)

            ||

            (entrant.email || "")
                .toLowerCase()
                .includes(search)

        );

    renderEntrants(filtered);

}


// -----------------------------------------------
// Display Winners
// -----------------------------------------------

function displayWinners(winners){


    if(
        !winners ||
        winners.length === 0
    ){

        winnerHistory.textContent =
            "No winners yet.";

        return;

    }



    winnerHistory.innerHTML =

        winners
        .map(

            winner =>

            `
            <p>
            <strong>
            ${winner.name}
            </strong>
            <br>
            ${winner.date || ""}
            </p>
            `

        )

        .join("");

}

// -----------------------------------------------
// Startup
// -----------------------------------------------

searchEntrants.addEventListener(
    "input",
    filterEntrants
);

loadDashboard();
loadEntrants();


