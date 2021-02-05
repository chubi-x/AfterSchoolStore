const express = require("express");

//create express instance
const app = express();

//configure express
app.use(express.json);
//set the headers
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

//connect to mongo client
const mongoClient = require("mongodb").mongoClient;
//create database instance
let db;
//connect to the cluster
mongoClient.connect("mongodb+srv://chubiXaX:Chubiyojo2120@cluster0.8mjq6.mongodb.net", (error,client)=>{
    //connect to the database
    db = client.db("cst3145");
});

//make the collection name a parameter
app.param("CollectionName",(req,res,next,collectionName)=>{
    req.collection = db.collection(collectionName);
    console.log("collection name:", req.collecion);
    return next();
});

// middleware to get all items in a collection
app.get("/:collectionName",(req,res,next)=>{
    req.collection.find({}).toArray((e,result)=>{
        if(e) return next(e);
        res.send(result);
    })
});

//define a port
const port = process.env.PORT || 3000;
//run the server
app.listen(port,()=>{
    console.log(`App running on port ${port}`);
})