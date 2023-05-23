


const express = require("express");
const mongoose = require ("mongoose");
const contactModel = require ("./models/contact");

require('dotenv').config()

let app= express ();
app.use("/", express.static("public"));

let port = process.env.PORT || 3000;

app.use (express.json());

const mongo_url = process.env.MONGODB_URL;
const mongo_user = process.env.MONGODB_USER;
const mongo_password = process.env.MONGODB_PASSWORD;

const url= "mongodb+srv://"+mongo_user +":" + mongo_password+ "@" + mongo_url +"/?retryWrites=true&w=majority"; 


console.log(url)

mongoose.connect(url).then(
    () => console.log("Connected to Mongo DB"),
    (error) => console.log ("Failed to connect to Mongo DB. Reason " + error)
)

app.get("/api/contact", function(req, res){
    contactModel.find().then(function(contacts){
        return res.status(200).json(contacts)

    }).catch(function (err){
        console.log("Database returned an error", err);
        return res.status(500).json({"Message":"Internal server error"})
    }) 
})

app.post("/api/contact", function(req, res){
    if(!req.body){
        return res.status(400).json({"Message":"Bad request"});
    }

    if(!req.body.firstname){
        return res.status(400).json({"Message":"Bad request"});
    }
    let contact = new contactModel({
        "firstname": req.body.firstname, 
        "lastname": req.body.lastname,
        "email":req.body.email,
        "phone": req.body.phone,

    })
    contact.save().then(function(contact){
        return res.status(201).json(contact);
    }).catch(function(err){
        console.log("Database returned an error", err);
        return res.status(500).json({"Message":"Internal server error"})

    })

})

app.delete("/api/contact/:id", function(req, res){
    contactModel.deleteOne({"_id":req.params.id }).then(function(){
        return res.status(200).json({"Message":"Success"})  
    }).catch(function (err){
        console.log("Database returned an error", err);
        return res.status(500).json({"Message":"Internal server error"})
    }) 

})

app.put("/api/contact/:id", function(req, res){
    if(!req.body){
        return res.status(400).json({"Message":"Bad request1"});
    }
    console.log("Requst body", req.body);
    if(!req.body.firstname){
        return res.status(400).json({"Message":"Bad request2"});
    }
    let contact = new contactModel({
        "firstname": req.body.firstname, 
        "lastname": req.body.lastname,
        "email":req.body.email,
        "phone": req.body.phone,

    })
    contactModel.replaceOne({"_id":req.params.id}, contact).then(function(){
        return res.status(200).json({"Message":"Success"})  
    }).catch(function (err){
        console.log("Database returned an error", err);
        return res.status(500).json({"Message":"Internal server error"})
    }) 

    
})

app.listen(3000);
console.log("Running in port 3000")