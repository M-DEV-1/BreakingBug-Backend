const dotenv = require("dotenv")
// ERROR
// dotenv should be listed first
// dotenv.config() should be listed right afterwards
dotenv.config();

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")


const app = express()
const Routes = require("./routes/route.js")

const PORT = process.env.PORT || 5000

app.use(express.json({ limit: '10mb' }))
app.use(cors())

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to MongoDB"))
    // ERROR
    // then should be function call
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))

app.use('/', Routes);

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})
