import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import { authSocket, socketServer } from "./socketServer.js";
import postsRouter from "./routes/posts.js";
import usersRouter from "./routes/users.js";
import commentsRouter from "./routes/comments.js";
import messagesRouter from "./routes/messages.js";
import PostLike from "./models/PostLike.js";
import Post from "./models/Post.js";

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

mongoose.set('strictQuery', true);

io.use(authSocket);
io.on("connection", (socket) => socketServer(socket));

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("MongoDB connected");
  }
);

mongoose.set('strictQuery', false);

httpServer.listen(process.env.PORT || 4000, () => {
  console.log("Listening");
});

app.use(express.json());
app.use(cors());
app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/messages", messagesRouter);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}
