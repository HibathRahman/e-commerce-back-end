const express = require("express");
const app = express();
const connectDB = require("./db");
connectDB();
const signinRouter = require("./routes/signin.js");
const loginRouter = require("./routes/login.js");
const homeRouter = require("./routes/home.js");
const productRouter = require("./routes/product.js");

const cors = require("cors");
const port = 4000;

// middlewares   ----json - post method
app.use(express.json());
app.use(express.static("images"));
// allow all
app.use(cors({ origin: "*" }));
app.use("/signin", signinRouter);
app.use("/login", loginRouter);
app.use("/home", homeRouter);
app.use("/product", productRouter);

// path  - get method
app.get("/", (req, res) => {
  res.send("succesful");
});

app.get("/user", (req, res) => {
  res.send(" hi user");
});

app.listen(port, () => {
  console.log(` app listening on port ${port}`);
});
