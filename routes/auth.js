/*
=================================================
 Ticketless Raffle v3

 Admin Login Routes

=================================================
*/


const express =
    require("express");


const router =
    express.Router();





router.post("/login",(req,res)=>{


    const password =
        req.body.password;



    const adminPassword =
        process.env.ADMIN_PASSWORD ||
        "VeteranAdmin123";



    if(password === adminPassword){


        req.session.isAdmin = true;


        return res.json({

            success:true

        });


    }



    res.status(401).json({

        success:false,

        error:
        "Invalid password"

    });



});






router.post("/logout",(req,res)=>{


    req.session.destroy();


    res.json({

        success:true

    });


});




module.exports =
    router;