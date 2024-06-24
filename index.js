const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config()


const app = express();

const port = process.env.PORT || 5000;

// middlewares 
app.use(cors({
  origin: ["http://localhost:5173",
    "https://cool-dolphin-57b1af.netlify.app"
  ],

}
))
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m4mzgzp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    const contactCollection = client.db('contactDB').collection('contacts')


    // post contacts to the server
    app.post('/contacts', async(req,res) =>{
        const newContact = req.body
        const result = await contactCollection.insertOne(newContact)
        res.send(result)
        
    })

    // get all contacts from db
    app.get('/contacts', async(req,res) => {
      const result = await contactCollection.find().toArray()
      res.send(result)
    })

    // get a contact by id
    app.get('/contact/:id', async(req,res)=> {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await contactCollection.findOne(query)
      res.send(result)
    })

    // delete a contact 

    app.delete('/contact/:id', async(req,res) => {
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await contactCollection.deleteOne(query)
      res.send(result)

    })

    // update a contact
    app.put('/contact/:id', async(req,res) => {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = {upsert:true}
      const updatedContact = req.body
      const contact = {
        $set: {
          userName: updatedContact.userName, 
          phoneNumber: updatedContact.phoneNumber, 
          userEmail : updatedContact.userEmail, 
          photo: updatedContact.photo, 
          address: updatedContact.address
        }
      }
      const result = await contactCollection.updateOne(filter,contact, options)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) => {
    res.send('Contact server is running')
})

app.listen(port, () => {
    console.log(`Contact server is running on port: ${port}`)
})