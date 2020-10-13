const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const MongoClient=require('mongodb').MongoClient;
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(cors());
const port =5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASS}@cluster0.9obvp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`; 


app.get('/',(req, res) => {
    res.send('hlw everyone')
})


const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

 app.listen(process.env.PORT||port);