const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kjpmx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productCollection = client.db('emajohndb').collection('products');
    await client.connect();
    app.get('/products', async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log(req.query);
      const query = {};
      const cursor = productCollection.find(query);
      let result;
      if (page || size) {
        result = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        result = await cursor.toArray();
      }
      res.send(result);
    });
    app.get('/productCount', async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const result = await cursor.count();
      res.send({ result });
      console.log(result)
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log('App is listen');
});
