require("dotenv").config();
const express = require("express");
var CronJob = require("cron").CronJob;

require("./database");

const job = new CronJob("42 00 12 * * *", function () {
  require("./hb_scraper");
});
job.start();

app = express();

// settings
const PORT = process.env.PORT || 5001;

// middelwars
//app.use(cors());
//app.use(express.json());

//routes
app.use("/api/v1/students", require("./routes/students"));
app.use("/api/v1/projects", require("./routes/projects"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
