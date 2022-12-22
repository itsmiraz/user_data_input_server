const express = require('express');
const cors = require('cors');

const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.fpgnyx0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const selectorsCollection = client.db('linkdinProject').collection('selectors')
        const userDataCollection = client.db('linkdinProject').collection('userData')
      
      
        app.get('/selectors', async (req, res) => {
            const query = {}
            const result = await selectorsCollection.find(query).toArray()
            res.send(result)
       })

        app.get('/userdata', async (req, res) => {
            const query = {}
            const result = await userDataCollection.find(query).toArray()
            res.send(result)
        })

        app.put('/userdata/:id', async (req, res) => {
            const body = req.body
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const option = {upsert:true}
            const updateDoc = {
                $set: {
                    name: body.name,
                    select:body.select
                }
            }
            const result = await userDataCollection.updateOne(query, updateDoc, option)
            res.send(result)
        })

        app.delete('/userdata/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id:ObjectId(id)}
            const result = await userDataCollection.deleteOne(query)
            res.send(result)
        })


        app.post('/userData', async (req, res) => {
            const userData = req.body;
            const result = await userDataCollection.insertOne(userData);
            res.send(result)
        })
        
      
    }
    finally {

    }
}

run().catch(err => console.log(err))





app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})