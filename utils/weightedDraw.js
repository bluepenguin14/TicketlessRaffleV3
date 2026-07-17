/*
=================================================
 Ticketless Raffle v3

 Weighted Draw Engine

 Responsibilities:
 - Select random winner
 - Respect ticket weights
 - Work efficiently with large raffles

=================================================
*/


/*
Example:

entries = [

 {
   name:"John",
   tickets:100
 },

 {
   name:"Mary",
   tickets:10
 }

]

Total tickets = 110

Random number chooses a point
between 1 and 110.

The entrant occupying that range wins.

*/


function weightedDraw(entries){


    if(!entries || entries.length === 0){

        throw new Error(
            "No entrants available"
        );

    }



    // --------------------------------------------
    // Calculate total tickets
    // --------------------------------------------

    const totalTickets =
        entries.reduce(

            (sum,entry)=>

                sum + Number(entry.tickets),

            0

        );



    if(totalTickets <= 0){

        throw new Error(
            "Invalid ticket total"
        );

    }




    // --------------------------------------------
    // Pick random ticket number
    // --------------------------------------------

    const randomNumber =

        Math.floor(

            Math.random() *

            totalTickets

        ) + 1;





    // --------------------------------------------
    // Find matching entrant
    // --------------------------------------------

    let ticketCounter = 0;



    for(const entry of entries){


        ticketCounter +=
            Number(entry.tickets);



        if(randomNumber <= ticketCounter){

            return entry;

        }

    }




    // Safety fallback

    return entries[
        entries.length - 1
    ];

}




module.exports = weightedDraw;
