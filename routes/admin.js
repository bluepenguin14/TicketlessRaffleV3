/*
=================================================
 Ticketless Raffle v3

 Admin Routes

 Responsibilities:
 - Manage raffle
 - Draw winners
 - Export data
 - Reset raffle

=================================================
*/


const express = require("express");

const router = express.Router();
 
const requireAdmin =
    require("../middleware/auth");
 
const raffleService =
    require("../services/raffleService");

router.use(requireAdmin);

const {
    exportEntrants,
    exportWinners

} = require("../utils/csvExport");



const {
    loadData,
    saveData
} = require("../services/storage");



// -----------------------------------------------
// Admin add entrant
// -----------------------------------------------

router.post("/add",(req,res)=>{


    try {


        const entrant =
            raffleService.addEntrant({

                name:req.body.name,

                email:req.body.email,

                tickets:req.body.tickets

            });



        res.json({

            success:true,

            entrant

        });



    }catch(error){


        res.status(400).json({

            success:false,

            error:error.message

        });


    }


});




// -----------------------------------------------
// List entrants
// -----------------------------------------------

router.get("/list",(req,res)=>{


    res.json({

        success:true,

        entries:
            raffleService.getEntries()

    });


});




// -----------------------------------------------
// Draw winner
// -----------------------------------------------

router.post("/draw",(req,res)=>{


    try {


        const winner =
            raffleService.drawWinner();



        res.json({

            success:true,

            winner

        });



    }catch(error){


        res.status(400).json({

            success:false,

            error:error.message

        });


    }


});




// -----------------------------------------------
// Winner history
// -----------------------------------------------

router.get("/winners",(req,res)=>{


    res.json({

        success:true,

        winners:
            raffleService.getWinners()

    });


});




// -----------------------------------------------
// Export entrants CSV
// -----------------------------------------------

router.get("/export/entrants",(req,res)=>{


    const data =
        loadData();



    const csv =
        exportEntrants(
            data.entries
        );


    res.header(
        "Content-Type",
        "text/csv"
    );


    res.attachment(
        "raffle-entrants.csv"
    );


    res.send(csv);


});





// -----------------------------------------------
// Export winners CSV
// -----------------------------------------------

router.get("/export/winners",(req,res)=>{


    const data =
        loadData();



    const csv =
        exportWinners(
            data.winners
        );


    res.header(
        "Content-Type",
        "text/csv"
    );


    res.attachment(
        "raffle-winners.csv"
    );


    res.send(csv);


});





// -----------------------------------------------
// Reset raffle
// -----------------------------------------------

router.post("/reset",(req,res)=>{


    try {


        raffleService.resetRaffle();



        res.json({

            success:true,

            message:
                "Raffle reset"

        });



    }catch(error){


        res.status(500).json({

            success:false,

            error:error.message

        });


    }


});


// -----------------------------------------------
// Dashboard statistics
// -----------------------------------------------

router.get("/stats",(req,res)=>{


    try {


        const entries =
            raffleService.getEntries();


        const winners =
            raffleService.getWinners();



        const totalTickets =
            entries.reduce(

                (sum,entry)=>
                    sum + Number(entry.tickets || 0),

                0

            );



        res.json({

            success:true,

            stats:{

                entrants:
                    entries.length,

                totalTickets,

                winners:
                    winners.length

            },

            winnerHistory:
                winners

        });



    }
    catch(error){


        res.status(500).json({

            success:false,

            error:error.message

        });


    }


});

// -----------------------------------------------
// Get All Entrants
// -----------------------------------------------

router.get("/entrants", (req, res) => {

    try {

        const data = loadData();

        res.json({

            success: true,

            entrants: data.entries

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});

// -----------------------------------------------
// Default CSV Export
// -----------------------------------------------

router.get("/export",(req,res)=>{


    const data =
        loadData();


    const csv =
        exportEntrants(
            data.entries
        );


    res.header(
        "Content-Type",
        "text/csv"
    );


    res.attachment(
        "raffle-entrants.csv"
    );


    res.send(csv);


});

// -----------------------------------------------
// Update Entrant
// -----------------------------------------------

router.put("/entrant/:id", (req, res) => {

    try {

        const data = loadData();

        const entrant = data.entries.find(
            e => e.id === req.params.id
        );

        if (!entrant) {

            return res.status(404).json({

                success: false,
                error: "Entrant not found"

            });

        }

        entrant.name = req.body.name.trim();
        entrant.email = (req.body.email || "").trim();
        entrant.tickets = Number(req.body.tickets);

        saveData(data);

        res.json({

            success: true,
            entrant

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            error: error.message

        });

    }

});

// -----------------------------------------------
// Delete Entrant
// -----------------------------------------------

router.delete("/entrant/:id", (req, res) => {

    try {

        const data = loadData();

        const index = data.entries.findIndex(
            e => e.id === req.params.id
        );

        if (index === -1) {

            return res.status(404).json({

                success: false,
                error: "Entrant not found"

            });

        }

        data.entries.splice(index, 1);

        saveData(data);

        res.json({

            success: true

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            error: error.message

        });

    }

});

module.exports = router;
