const express = require('express')
const {versionRoutes} = require('./api/v1/routes/routes')


const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.get('/', (req, res) => {
    res.status(200).json("WELCOME TO DIGITAL KANZARA")
})
app.use('/api/v1',versionRoutes)

app.use((err, req, res, next) => {
    res.status(err.status).json({
        error: {
            msg: err.message,
            details: err.details
        }
    })
})
module.exports = {
    app
}