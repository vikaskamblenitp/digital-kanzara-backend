const express = require('express')
const cors = require('cors')
const path = require("path");
const {versionRoutes} = require('./api/v1/routes/routes')


const app = express()

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use("/.data",express.static(".data"))
app.use(express.static(path.join(__dirname, ".data")));
app.get('/', (req, res) => {
    res.status(200).json("WELCOME TO DIGITAL KANZARA")
})
app.use('/api/v1',versionRoutes)

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            msg: err.message,
            details: err.details
        }
    })
})
module.exports = {
    app
}