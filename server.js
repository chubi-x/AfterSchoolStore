//import express
const express = require("express");
import { MongoClient } from 'mongodb'
//create express instance
const app = express();

const client = new MongoClient("mongodb+srv://chubixax:yNE4gnwZq4S2l8Dp@cluster0.m3ksss7.mongodb.net")
let db
async function connectAndRun (): Promise<void> {
  try {
    await client.connect()
    db = client.db('cst3145')
    console.log('Connected successfully to Database')
    const port = process.env.PORT ?? 3000
    app.listen(port, () => {
      console.log(`App running on port ${port}`)
    })
  } catch (error: any) {
    console.error('Error Connecting to Database', error)
    await client.close()
  }
}
await connectAndRun();
//configure express
app.use(express.json());
//specify where to get static files
app.use(express.static('public'));
//set the headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers",'Origin,X-Requested-With,Content-Type,Accept');
    res.setHeader('Access-Control-Allow-Methods','PUT');
    next();
});


//make the collection name a parameter
app.param("collectionName", (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName);
    console.log("collection name:", req.collection);
    return next();
});

app.get("/", (req, res, next) => {
    res.render("index.html");
    next();
});

// middleware to get all items in a collection
app.get("/:collectionName", (req, res, next) => {
    req.collection.find({}).toArray((e, result) => {
        if (e) return next(e);
        res.send(result);
    })
});

//middleware to post items to collection
app.post("/:collectionName", (req, res, next) => {
    req.collection.insert(req.body, (err, result) => {
        if (err) return next(err);
        res.send(result.ops);
    });
})
//middleware to retrieve items by object ID
// const ObjectID = require('mongodb').ObjectID;
app.get("/:collectionName/:name/:phone", (req, res, next) => {
    req.collection.find({
        name: (req.params.name),
        phone: (req.params.phone)
    }).toArray((e,result)=>{
         if(e) return next(e);
         res.send(result);
    })
});

//middleware to update items in collection
// app.put("/:collectionName/:id", (req, res, next) => {
//     req.collection.update({
//             _id: new ObjectID(req.params.id)
//         }, {
//             $set: req.body
//         }, {
//             safe: true,
//             multi: false
//         },
//         (e, result) => {
//             if (e) return next(e);
//             res.send((result.result.n === 1 ? {
//                 msg: "success"
//             } : {
//                 msg: "error"
//             }))
//         }
//     )
// })

//define a port
const port = process.env.PORT || 3000;
//run the server
app.listen(port, () => {
    console.log(`App running on port ${port}`);
})
