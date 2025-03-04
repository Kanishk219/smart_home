import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import EnergyUsage from './models/EnergyUsage.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));


app.get('/', (req, res) => res.send("API is Running 🚀"));


app.post('/api/energy', async (req, res) => {
    try {
        const newEntry = new EnergyUsage(req.body);
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get("/api/energy", async (req, res) => {
    console.log("GET request received at /api/energy"); 
    try {
      const data = await EnergyUsage.find();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ message: error.message });
    }
  });  

app.put('/api/energy/:id', async (req, res) => {
    try {
        const updatedData = await EnergyUsage.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.delete('/api/energy/:id', async (req, res) => {
    try {
        await EnergyUsage.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Entry deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

