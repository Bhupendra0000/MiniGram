const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path"); 
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.set("io", io);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/post"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
res.send("Backend is running ");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
console.log("Server running on " + PORT);
});