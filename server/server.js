const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const route = require("./routes/route");

//middlewares
const corsOptions = {
  origin: "http://127.0.0.1:5173",
  methods: "GET,PUT,POST,DELETE",
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api", route);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
