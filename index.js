const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9obvp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log(process.env.DB_NAME,process.env.DB_PASS,process.env.DB_USER)


app.get('/', (req, res) => {
    res.send('hlw everyone')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db(`${process.env.DB_NAME}`).collection("companies");
    console.log('database connected')

    app.get('/allcompanies', (req, res) => {
        collection.find({})
          .toArray((err, documents) => {
            res.send(documents);
          })
        console.log(err)
        console.log('data loaded successfully')
      })
});

app.listen(process.env.PORT || port);