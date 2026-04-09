const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://nikcode00_db_user:Nik1o2o3o40@cluster1.zmlmrbh.mongodb.net/mydb")
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.set("io", io);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/post"));
app.use("/uploads", express.static("uploads"));

server.listen(5000, () => 
console.log("Backend running on port 5000"));



