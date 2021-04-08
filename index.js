const express = require("express");
const app = express();
// const bodyParser = require('body-parser');
const cors = require("cors");
require("dotenv").config();
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(express.json()); //instead of bodyparser
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// sakib
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.abcuj.mongodb.net//${process.env.DB_NAME}?retryWrites=true&w=majority`;
//  console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log(err);
  const productCollection = client.db("grocery").collection("groceryItems");
  const ordersCollection = client.db("grocery").collection("orders");

  //sending all data to server (fakeData removed)
  app.post("/addItems", (req, res) => {
    const item = req.body;
    productCollection.insertMany(item).then((result) => {
      res.send(result.insertedCount);
    });
  });

  //Loading all product for Home Page
  app.get('/products', (req, res) =>{
    productCollection.find()
    .toArray((err, products) =>{
      res.send(products)
      // console.log('from db ', products);
    })
  })


  // loading product with an specific id
app.get('/product/:id', (req, res) =>{
  console.log(req.params);
  productCollection.find({_id: ObjectId(req.params.id)})
  .toArray((err, products) =>{
    res.send(products[0])
  })
})

// sending order to server
  app.post("/addOrder", (req, res) => {
    const order = req.body;
    console.log("adding new Product : ", order);
    ordersCollection.insertOne(order).then((result) => {
      console.log("inserted Count", result);
      res.send(result.insertedCount > 0);
    });
  });

  // loading orders filtering with email 
  app.get('/orders', (req, res) =>{
    // console.log(req.query.email);
    ordersCollection.find({email : req.query.email})
    .toArray((err, orders) =>{
      res.send(orders)
    })
  })

    //adding a single product by the admin
    app.post("/addProduct", (req, res) => {
      const newProduct = req.body;
      console.log("adding new Product : ", newProduct);
      productCollection.insertOne(newProduct).then((result) => {
        console.log("inserted Count", result);
        res.send(result.insertedCount > 0);
      });
    });

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// const express = require('express')
// const app = express()
// // const bodyParser = require('body-parser');
// const cors = require('cors');
// require('dotenv').config();

// const port = process.env.PORT || 5000;

// app.use(express.json());
// app.use(cors());

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// // sakib
// const MongoClient = require('mongodb').MongoClient;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.abcuj.mongodb.net//${process.env.DB_NAME}?retryWrites=true&w=majority`;
//  console.log(uri);
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("grocery").collection("groceryItems");
//   console.log('connection error',err);
//   // perform actions on the collection object

// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })

// // mainuddin
// const MongoClient = require('mongodb').MongoClient;
// const uri = `mongodb+srv://${process.env.DB_USER}:{process.env.DB_PASS}@cluster0.insgn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);

// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//     console.log('connection error',err);
//   const collection = client.db("groceries").collection("groItems");
//   // perform actions on the collection object

// });

// another db of mainuddin
// const MongoClient = require('mongodb').MongoClient;
// const uri = `mongodb+srv://${process.env.DB_USER}:{process.env.DB_PASS}@cluster0.insgn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//     console.log('connection error',err);
//   const collection = client.db("grocery").collection("groceryItems");

// });
