require("dotenv").config();

const express = require('express');
const app = express();
const PORT = 5000;
const authRoute = require("./router/auth-router");
const contactRoute = require("./router/contact-router");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");
// Middleware
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/form", contactRoute);




// Error middleware
app.use(errorMiddleware);
// Start the server
connectDb().then(()=>{
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});