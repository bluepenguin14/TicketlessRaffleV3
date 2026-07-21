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


            await loadDashboard();

            await loadEntrants();



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

            

        }


    }
    catch(error){

        console.error(error);

    }


}


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

    console.error("loadEntrants error:", error);

}

}



// -----------------------------------------------
// Save/Add Entrant
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

await loadDashboard();

await loadEntrants();

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

row.querySelector(".editButton")
    .addEventListener(
        "click",
        () => openEditModal(entrant)
    );

        row.querySelector(".deleteButton")
    .addEventListener(

        "click",

        () => deleteEntrant(entrant.id)

    );

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
// Delete Entrant
// -----------------------------------------------

async function deleteEntrant(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this entrant?"
    );

    if (!confirmed) {
        return;
    }

    // existing delete code continues here...

    try {

        const response = await fetch(

            `/api/admin/entrant/${id}`,

            {
                method: "DELETE",
                credentials: "include"
            }

        );

        const result = await response.json();

        if (!result.success) {

            alert(result.error);
            return;

        }

        await loadDashboard();
        await loadEntrants();

    }

    catch (error) {

        console.error(error);
        alert("Unable to delete entrant.");

    }

}

// -----------------------------------------------
// Open Edit Modal
// -----------------------------------------------

function openEditModal(entrant) {

    document.getElementById("editId").value =
        entrant.id;

    document.getElementById("editName").value =
        entrant.name;

    document.getElementById("editEmail").value =
        entrant.email || "";

    document.getElementById("editTickets").value =
        entrant.tickets;

    document.getElementById("editModal").style.display =
        "block";

}

// -----------------------------------------------
// Save Edited Entrant
// -----------------------------------------------

async function saveEditedEntrant() {

    const id =
        document.getElementById("editId").value;

    const name =
        document.getElementById("editName").value.trim();

    const email =
        document.getElementById("editEmail").value.trim();

    const tickets =
        Number(
            document.getElementById("editTickets").value
        );

    try {

        const response = await fetch(

            `/api/admin/entrant/${id}`,

            {

                method: "PUT",

                credentials: "include",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    name,
                    email,
                    tickets

                })

            }

        );

        const result =
            await response.json();

        if (!result.success) {

            alert(result.error);
            return;

        }

        document.getElementById("editModal").style.display =
            "none";

        await loadDashboard();
        await loadEntrants();

    }

    catch (error) {

        console.error(error);

        alert("Unable to update entrant.");

    }

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

document
.getElementById("cancelEditButton")
.addEventListener(

    "click",

    () => {

        document.getElementById("editModal").style.display =
            "none";

    }

);

document
.getElementById("saveEditButton")
.addEventListener(

    "click",

    saveEditedEntrant

);



