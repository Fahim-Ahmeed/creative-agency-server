const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;
const fileUpload = require('express-fileupload');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;
app.use(express.static('service'));
app.use(fileUpload());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9obvp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

console.log(process.env.DB_NAME, process.env.DB_PASS, process.env.DB_USER)


app.get('/', (req, res) => {
  res.send('hlw everyone')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const companies = client.db(`${process.env.DB_NAME}`).collection("companies");
  const services = client.db(`${process.env.DB_NAME}`).collection("services");
  const feedback = client.db(`${process.env.DB_NAME}`).collection("feedback");
  const admin = client.db(`${process.env.DB_NAME}`).collection("adminPanel");
  const customer = client.db(`${process.env.DB_NAME}`).collection("customer");


  console.log('database connected')

  app.get('/allcompanies', (req, res) => {
    companies.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
    console.log(err)
    console.log('data loaded successfully')
  })


  app.get('/allservices', (req, res) => {
    services.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
    console.log(err)
    console.log('data loaded successfully')
  })

  app.get('/feedback', (req, res) => {
    feedback.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
    console.log(err)
    console.log('data loaded successfully')
  })

  app.get('/findAdmin', (req, res) => {
    console.log(req.query.email)
    admin.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })


  app.post('/addService', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const description = req.body.description;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
    };

    services.insertOne({ name, description, image })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/allCustomer', (req, res) => {
    customer.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
    console.log(err)
    console.log('customer loaded successfully')
  })
  
  app.post('/addCustomer', (req, res) => {
    const fileOne = req.files.fileOne;
    const name = req.body.name;
    const email = req.body.email;
    const work = req.body.work;
    const details = req.body.details;
    const price = req.body.price;
    const status= req.body.status;
    const ClientImg = fileOne.data;
    const encImgClient = ClientImg.toString('base64');

    var image = {
      contentType: fileOne.mimetype,
      size: fileOne.size,
      img: Buffer.from(encImgClient, 'base64')
    };
    customer.insertOne({ name, email, work, details, price,status,image })
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.get('/findCustomer', (req, res) => {
    customer.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })


  
  app.post('/addfeedback', (req, res) => {
    const newFeedback = req.body;
    console.log(newFeedback)
    feedback.insertOne(newFeedback)
      .then(result => {
        if (result.insertedCount > 0) {
          res.send(result)
        }
        console.log('feedback added successfully')
      })

  })


  app.post('/makeAdmin', (req, res) => {
    admin.insertOne(req.body)
      .then(result => {
        if (result.insertedCount > 0) {
          res.send(result)
        }
        console.log('admin added successfully')
      })

  })
  app.patch('/updateStatus/:id', (req, res) => {
    console.log(req.body)
    customer.updateOne({ _id: ObjectId(req.params.id) },
      {
        $set: { status: req.body.updateStatus}
      }
    )
      .then(result =>{
        console.log('status updated successfully')
        console.log(result)
        res.send(result)
       
        
      })
  })

});


app.listen(process.env.PORT || port);