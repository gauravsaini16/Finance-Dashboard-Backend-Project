import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/db.js";
import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import recordRoutes from "./routes/records.js";
import dashboardRoutes from "./routes/dashboard.js";



connectDB()

const app = express();
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Finance Backend API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});