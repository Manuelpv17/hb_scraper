const mongoose = require("mongoose");

const localURI = "mongodb://localhost/hb_scraper";
const URI = process.env.MONGODB_URI || localURI;

mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log(`MongoDB Connected to ${URI}`))
  .catch((err) => console.log(err));
