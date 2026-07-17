/*
=================================================
 Ticketless Raffle v3

 Public Routes

 Responsibilities:
 - Allow entrants to enter raffle
 - Provide public raffle information

=================================================
*/


const express = require("express");

const router = express.Router();


const raffleService =
    require("../services/raffleService");



// -----------------------------------------------
// Enter raffle
// -----------------------------------------------

router.post("/enter", (req,res)=>{


    try {


        const entrant =
            raffleService.addEntrant({

                name:
                    req.body.name,

                email:
                    req.body.email,

                tickets:
                    req.body.tickets

            });



        res.json({

            success:true,

            message:
                "Entry received",

            entrant

        });



    } catch(error){


        res.status(400).json({

            success:false,

            error:
                error.message

        });


    }


});




// -----------------------------------------------
// Public statistics
// -----------------------------------------------

router.get("/stats",(req,res)=>{


    try {


        res.json({

            success:true,

            stats:
                raffleService.getStats()

        });



    }catch(error){


        res.status(500).json({

            success:false,

            error:
                error.message

        });


    }


});




module.exports = router;
