const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/tasks', taskRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


