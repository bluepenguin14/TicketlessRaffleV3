/*
=================================================
 Ticketless Raffle v3

 CSV Export Utility

 Responsibilities:
 - Convert raffle data into CSV format
 - Prepare Excel-compatible exports
 - Keep reporting separate from raffle logic

=================================================
*/


const { stringify } = require("csv-stringify/sync");



// -----------------------------------------------
// Export entrants as CSV
// -----------------------------------------------

function exportEntrants(entries){


    if(!entries || entries.length === 0){

        return stringify([

            {
                name:"No entrants",
                email:"",
                tickets:"",
                timestamp:""

            }

        ],{

            header:true

        });

    }



    const csv = stringify(

        entries.map(entry => ({


            Name:
                entry.name,


            Email:
                entry.email,


            Tickets:
                entry.tickets,


            Entered:
                entry.timestamp


        })),

        {

            header:true

        }

    );



    return csv;

}





// -----------------------------------------------
// Export winners as CSV
// -----------------------------------------------

function exportWinners(winners){


    if(!winners || winners.length === 0){

        return stringify([

            {

                name:"No winners",

                tickets:"",

                date:""

            }

        ],{

            header:true

        });

    }




    return stringify(

        winners.map(winner => ({


            Name:
                winner.name,


            Tickets:
                winner.tickets,


            Date:
                winner.date


        })),

        {

            header:true

        }

    );

}





module.exports = {

    exportEntrants,

    exportWinners

};
