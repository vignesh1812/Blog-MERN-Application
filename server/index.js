const express = require("express");
const { connect } = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const upload=require('express-fileupload');
const userRoutes=require('./Routes/userRoutes');
const postRoutes=require('./Routes/postRoutes');
const {notFound,erorMiddleware}=require('./Middleware/errorMiddleware')
const app = express();
app.use(upload());
app.use('/uploads',express.static(__dirname+'/uploads'))
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,  // Enable credentials (cookies, etc.)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,  // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use( cors(corsOptions));
const PORT = process.env.PORT || 5000;
app.use('/api/users',userRoutes)
app.use('/api/posts',postRoutes)

app.use(notFound)
app.use(erorMiddleware)

connect(process.env.MONGODB_URL)
  .then(
    app.listen(PORT, () => {
      console.log(`DB connected & Server is Running on ${PORT}`);
    })
  )
  .catch((err) => console.error(err));
