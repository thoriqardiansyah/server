const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const cookieParse = require("cookie-parser");
require("dotenv").config();
const path = require("path");

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: true }));
app.use(cookieParse());
app.use(
  "/public/images",
  express.static(path.join(__dirname + "/public/images"))
);

// import routes
const {
  authRoute,
  categoryRoute,
  stackRoute,
  portfolioRoute,
} = require("./routes");

app.get("/", (req, res) => {
  res.send("hello bajingan");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/stack", stackRoute);
app.use("/api/v1/portfolio", portfolioRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
