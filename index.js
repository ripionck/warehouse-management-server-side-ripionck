const express = require('express')
const app = express()
const {ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 4000;
//const port = 4000
const cors = require("cors");

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
  
      // get multiples
      //http://localhost:4000/inventoryItems
      app.get("/inventoryItems", async (req, res) => {
        const q = req.query;
        //console.log(q);
  
        const cursor = booksCollection.find( q);
        const result = await cursor.toArray();
  
        res.send(result);
      });

     //get one
     //http://localhost:4000/inventoryItems/626e7e85bfcdae3b7161e7b2
      app.get('/inventoryItems/:id', async (req, res) => {
        const id = req.params.id;
        //console.log(id);

        const query = { _id: ObjectID(id) };
        const inventoryItem = await booksCollection.findOne(query);

        res.send(inventoryItem);
      });

      //create
      //http://localhost:4000/note
  
      app.post("/inventoryItems", async (req, res) => {
        const data = req.body;
        //console.log("from post api", data);
  
        const result = await booksCollection.insertOne(data);
  
        res.send(result);
      });
  
      // update 
      //http://localhost:4000/inventoryItems/626e7e85bfcdae3b7161e7b2
      app.put("/inventoryItems/:id", async (req, res) => {
        const id = req.params.id;
        const data = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
  
        const updateStock = {
          $set: {
            quantity: data.quantity,
          },
        };
  
        const result = await booksCollection.updateOne(
          filter,
          updateStock,
          options
        );
         console.log('from put method',id)
        res.send(result);
      });
  
      // delete 
      //http://localhost:4000/inventoryItems/626e7e85bfcdae3b7161e7b2
      app.delete("/inventoryItems/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
  
        const result = await booksCollection.deleteOne(filter);
  
        res.send(result);
      });

      /* //my items
      app.get("/myItems", async(req, res) =>{
        const decodedEmail = req.decoded.email;
        const email = req.query.email;
        if(email === decodedEmail){
          const query = {email: email};
          const cursor = 
        }
      })
   */

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