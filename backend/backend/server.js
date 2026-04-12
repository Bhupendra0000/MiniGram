const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();

app.use(cors({
origin: [
  "http://localhost:3000",
  "https://mini-gram-orpin.vercel.app"
],
credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const server = http.createServer(app);

const io = new Server(server, {
cors: {
  origin: [
    "http://localhost:3000",
    "https://mini-gram-orpin.vercel.app"
  ]
}
});

app.set("io", io);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/post"));

app.get("/", (req, res) => {
res.send("Backend running 🚀");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
console.log("Server running on " + PORT);
});