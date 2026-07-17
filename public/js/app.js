/*
=================================================
 Ticketless Raffle v3

 Public App JavaScript

 Responsibilities:
 - Handle raffle entry form
 - Control ticket quantity
 - Send data to backend API
 - Display messages
 - Load raffle statistics

=================================================
*/


// -----------------------------------------------
// Variables
// -----------------------------------------------

let ticketCount = 1;


const form =
    document.getElementById("raffleForm");


const ticketsDisplay =
    document.getElementById("ticketCount");


const message =
    document.getElementById("message");


const entrantCount =
    document.getElementById("entrantCount");


const totalTickets =
    document.getElementById("totalTickets");




// -----------------------------------------------
// Ticket buttons
// -----------------------------------------------

document
.getElementById("plus")
.addEventListener(
    "click",
    ()=>{


        ticketCount++;


        updateTicketDisplay();


    }
);



document
.getElementById("minus")
.addEventListener(
    "click",
    ()=>{


        if(ticketCount > 1){

            ticketCount--;

        }


        updateTicketDisplay();


    }
);





function updateTicketDisplay(){


    ticketsDisplay.textContent =
        ticketCount;


}






// -----------------------------------------------
// Submit raffle entry
// -----------------------------------------------

form.addEventListener(
"submit",

async(event)=>{


    event.preventDefault();



    const name =
        document
        .getElementById("name")
        .value;



    const email =
        document
        .getElementById("email")
        .value;





    const entry = {


        name,

        email,

        tickets:
            ticketCount


    };




    try {


        const response =
            await fetch(
                "/api/enter",
                {

                    method:"POST",

                    headers:{

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(entry)

                }

            );



        const result =
            await response.json();





        if(result.success){


            message.textContent =
                "Thank you! Your raffle entry has been received.";


            message.className =
                "success";



            form.reset();



            ticketCount = 1;


            updateTicketDisplay();



            loadStats();


        }

        else {


            message.textContent =
                result.error;


            message.className =
                "error";


        }





    }

    catch(error){


        console.error(error);


        message.textContent =
            "Unable to submit entry. Please try again.";


        message.className =
            "error";


    }


});






// -----------------------------------------------
// Load raffle statistics
// -----------------------------------------------

async function loadStats(){


    try {


        const response =
            await fetch(
                "/api/stats"
            );


        const result =
            await response.json();



        if(result.success){


            entrantCount.textContent =
                result.stats.entrants;



            totalTickets.textContent =
                result.stats.totalTickets;


        }



    }

    catch(error){


        console.error(
            "Stats error:",
            error
        );


    }


}




// Load stats when page opens

loadStats();
