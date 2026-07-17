/*
=================================================
 Ticketless Raffle v3
 Main Server

 Responsibilities:
 - Start Express
 - Load routes
 - Serve website files
 - Handle errors

=================================================
*/


const express = require("express");
const path = require("path");

const publicRoutes = require("./routes/public");
const adminRoutes = require("./routes/admin");
const session = require("express-session");
const authRoutes = require("./routes/auth");

const app = express();

app.use(
    session({

        secret:
        "change-this-secret",

        resave:false,

        saveUninitialized:false

    })
);

// -----------------------------
// Configuration
// -----------------------------

const PORT = process.env.PORT || 3000;


// -----------------------------
// Middleware
// -----------------------------

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// Serve frontend files

app.use(express.static(
    path.join(__dirname, "public")
));


// -----------------------------
// API Routes
// -----------------------------

app.use("/api", publicRoutes);

app.use("/api/admin", adminRoutes);

app.use(
    "/api/auth",
    authRoutes
);

// -----------------------------
// Default Route
// -----------------------------

app.get("*", (req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "public",
            "index.html"
        )
    );

});


// -----------------------------
// Error Handler
// -----------------------------

app.use((err,req,res,next)=>{

    console.error(err);

    res.status(500).json({

        success:false,

        error:"Server error"

    });

});


// -----------------------------
// Start Server
// -----------------------------

app.listen(PORT, ()=>{

    console.log(
        `Ticketless Raffle v3 running on port ${PORT}`
    );

});
