const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.Port || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qupsx4j.mongodb.net/?retryWrites=true&w=majority`;

// Created a MongoClient object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        client.connect();

        const toyCollections = client.db("toyCollection").collection("allToys");
        const usersToyCollection = client.db("toyCollection").collection('usersToy');
        // console.log(toyCollections);

        // to get all data from server.
        app.get('/toys', async (req, res) => {
            const cursor = toyCollections.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // to get data for all toy page. Data is limited to 20
        app.get('/limitedtoys', async (req, res) => {
            const cursor = toyCollections.find().limit(20);
            const result = await cursor.toArray();
            res.send(result);
        })
        // To get data for single toy details.
        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await toyCollections.findOne(query);
            console.log(result);
            res.send(result);
            // console.log(result);
        })
        // post new toy from client side
        app.post('/myToys', async (req, res) => {
            const newToy = req.body;
            // console.log(newToy);
            const result = await usersToyCollection.insertOne(newToy);
            res.send(result);
        })
        // get user specific toy information
        app.get('/myToys', async (req, res) => {
            // console.log(req.query.email);
            let query = {};
            if(req.query?.email){
                query = {sellerEmail: req.query.email}
                // console.log(query);
            }
            const result = await usersToyCollection.find(query).toArray();
            res.send(result);
            // console.log(result);
        })

        // delete specific toy
        app.delete('/myToys/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await usersToyCollection.deleteOne(query);
            res.send(result);
        })

        
        // search toy by Toyname
        // app.get('/searchToy/:text', async (req, res) => {
        //     const query = req.params.text;
        //     console.log(query);
        //     if(!query) {
        //         return res.status(400).json({ message: "Please enter a Toyname" });
        //     }
        //     const result = await toyCollections.find({ toyName: { $regex: query, $options: "i" } }).toArray();
        // })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send("EduJoyToy Server is running");
})

app.listen(port, () => {
    console.log(`My toy website is Running on Port: ${port}`);
});

