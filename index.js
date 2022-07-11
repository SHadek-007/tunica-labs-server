const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7r9io.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const studentCollection = client.db("tunica-labs").collection("students");

    // Add Student
    app.post("/students", async (req, res) => {
      try {
        const newStudent = req.body;
        console.log(newStudent);
        const result = await studentCollection.insertOne(newStudent);
        res.send(result);
      } catch (error) {
        res.send(error);
      }
    });

    // View Students
    app.get("/allStudents", async (req, res) => {
      try {
        const query = {};
        const cursor = studentCollection.find(query);
        const allStudents = await cursor.toArray();
        res.send(allStudents);
      } catch (error) {
        res.send(error);
      }
    });

    // edit student
    app.get("/student/:id", async (req, res) => {
      try {
        const id = req.params.id;
        console.log(id);
        const query = { _id: ObjectId(id) };
        const student = await studentCollection.findOne(query);
        res.send(student);
      } catch (error) {
        res.send(error);
      }
    });

    // patch student
    app.patch("/student/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const student = await studentCollection.findOneAndUpdate(query, {
          $set: req.body,
        });
        res.send(student);
      } catch (error) {
        res.send(error);
      }
    });

    // delete
    app.delete('/student/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await studentCollection.deleteOne(query);
        res.send(result);
    });
    
  } finally {
  }
}
app.get("/", (req, res) => {
  res.send("Hello Tunica Labs");
});

app.listen(port, () => {
  console.log(`Running Tunica Labs on port ${port}`);
});

run().catch(console.dir);
