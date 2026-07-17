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


loginButton.addEventListener(
"click",

async()=>{


    const response =
        await fetch(
            "/api/auth/login",
            {

                method:"POST",

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


        const response =
            await fetch("/api/admin/stats");


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


        }


    }
    catch(error){

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

                    headers:{

                        "Content-Type":
                        "application/json"

                    },

                    body:
                    JSON.stringify({

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

                method:"POST"

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

                method:"POST"

            }
        );



    const result =
        await response.json();



    if(result.success){


        alert(
            "Raffle reset complete."
        );


        loadDashboard();


    }



});








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





// Initial load

loadDashboard();
