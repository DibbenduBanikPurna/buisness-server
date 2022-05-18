const express=require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app=express();
app.use(cors());
app.use(express.json())

const uri = "mongodb+srv://sajeeb:123456sajeeb@cluster0.wiibo.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.get("/",(req,res)=>{
    res.send("Hello Open my server");
})




async function run() {
  try {
    await client.connect();
   
    const database = client.db("buisnessDB");
    const productCollection = database.collection("product");

    //post new product
    app.post("/addproduct",async(req,res)=>{
        console.log(req.body)
        const product = req.body
        const result = await productCollection.insertOne(product);
        console.log(result)
        res.json(result)
    })

    //get all products
    app.get("/products", async(req,res)=>{
        const cursor = productCollection.find({})
        const result = await cursor.toArray()
        res.send(result)
    })

    //get single Products
    app.get("/product/:id", async (req,res)=>{
        const result = await productCollection.findOne({id:req.params.id})
        res.send(result)
    })
    //delete product
    app.delete("/product/:id", async (req,res)=>{
        console.log(req.params.id)
        const result = await productCollection.deleteOne({id:req.params.id});
        res.send(result);
    })

    app.put("/product/:id", async(req,res)=>{
        const product = req.body;
            const filter = { id: product.id };
            const options = { upsert: true };
            const updateDoc = { $set: product };
            const result = await productCollection.updateOne(filter, updateDoc, options);
            // console.log(result)
            res.json(result)

    })

   
    console.log("database connected");
  } finally {
   
  }
}
run().catch(console.dir);





app.listen(5000,()=>{
    console.log("server starts");
})