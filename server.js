const express = require('express')
const path = require("path")
const cors = require("cors")
require("dotenv").config()
const PORT  = process.env.PORT || 5000;

const app = express()


//Set a static folder 
app.use(express.static(path.join(__dirname,"public")))

//create a route endpoint for server to load
app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,"public","index.html"))
})

// a route endpoint when the url is "/fetch", uses routes folder 
app.use('/fetch', require("./routes"))

// cross-origin resource sharing
app.use(cors());

app.listen(PORT, () => console.log(`Server running on ${PORT}`))