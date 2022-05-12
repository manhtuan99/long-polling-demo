const express = require("express");
const cors = require("cors");
const uuid = require("uuid");

const server = express();
server.use(cors());
server.use(express.urlencoded({ extended: false }));
server.use(express.json({ limit: "5mb" }));

const MAX_CLIENTS = 1;
let clients = [];

server.post("/", async (req, res, next) => {
  if (clients.length >= MAX_CLIENTS) {
    return res.status(423).json({ message: "maximum lock reached" });
  }
  const id = uuid.v4();

  req.on("close", () => {
    console.log(`request ${id} is aborted`);
    clients = clients.filter((item) => item.id !== id);
  });

  clients.push({ id, res });
});

server.listen(3000, (err) => {
  if (err) console.error(error);
  else console.log("Listening on port 3000");
});
