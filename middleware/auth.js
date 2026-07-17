/*
=================================================
 Ticketless Raffle v3

 Admin Authentication Middleware

 Purpose:
 - Protect admin routes
 - Require admin login

=================================================
*/


function requireAdmin(req, res, next) {


    if (
        req.session &&
        req.session.isAdmin
    ) {

        return next();

    }



    return res.status(401).json({

        success:false,

        error:
        "Unauthorized"

    });


}



module.exports =
    requireAdmin;