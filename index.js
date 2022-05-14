const express = require('express')
const app = express()
const {ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 4000;

const cors = require("cors");
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectID } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.v07pk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 client.connect(err => {
  const collection = client.db("test").collection("devices");
});

async function run() {
    try {
      await client.connect();
      const booksCollection = client.db("bookKeeper").collection("inventoryItems");
      const myCollection = client.db('bookKeeper').collection('myItems');
  
     //get user
     app.post("/login", (req, res)=>{
       const email = req.body;
      
       const token = jwt.sign(email , process.env.ACCESS_TOKEN_SECRET);

       res.send({token})
     })


      // get multiples
      app.get("/inventoryItems", async (req, res) => {
        const q = req.query;
        //console.log(q);
  
        const cursor = booksCollection.find( q);
        const result = await cursor.toArray();
  
        res.send(result);
      });

     //get one
      app.get('/inventoryItems/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);

        const query = { _id: ObjectID(id) };
        const inventoryItem = await booksCollection.findOne(query);

        res.send(inventoryItem);
      }); 

      //create one
      app.post("/inventoryItems", async (req, res) => {
        const data = req.body;
        //console.log("from post api", data);
  
        const result = await booksCollection.insertOne(data);
  
        res.send(result);
      });
  
      // update 
      app.put("/inventoryItems/:id", async (req, res) => {
        const id = req.params.id;
        const data = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
  
        const updateStock = {
          $set: {
            quantity:parseInt( data.quantity),
          },
        };
  
        const result = await booksCollection.updateOne(
          filter,
          updateStock,
          options
        );
         //console.log('from put method',id)
        res.send(result);
      });
  
      // delete 
      app.delete("/inventoryItems/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
  
        const result = await booksCollection.deleteOne(filter);
  
        res.send(result);
      });

   //my items API
   app.get('/myItems', async(req, res)=>{
     const query = {};
     const cursor = myCollection.find(query);
     const myItems = await cursor.toArray();
     res.send(myItems)
   })

      //my items
      app.post('/myItems', async(req, res) =>{
        const myItems = req.body;
        const result = await myCollection.insertOne(myItems);
        res.send(result);
      })


      console.log("Server is running!!");
    } finally {
    }
  }
  
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});