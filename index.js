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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const toyCollections = client.db("toyCollection").collection("allToys");
        // console.log(toyCollections);

        app.get('/toys', async (req, res) => {
            const cursor = toyCollections.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/sciencekits', async (req, res) => {
            const cursor = toyCollections.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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