const url = require('url')
const express = require('express')
const router = express.Router()
//  lightweight fetching package
const needle = require('needle')

const GOOGLE_API_URL= process.env.GOOGLE_API_URL
const GOOGLE_KEY_NAME= process.env.GOOGLE_KEY_NAME
const GOOGLE_KEY_VALUE= process.env.GOOGLE_KEY_VALUE

const OPENWEATHER_API_URL = process.env.OPENWEATHER_API_URL
const OPENWEATHER_KEY_NAME = process.env.OPENWEATHER_KEY_NAME
const OPENWEATHER_KEY_VALUE = process.env.OPENWEATHER_KEY_VALUE

router.get('/', async (req,res) =>{
       try {
           const query = url.parse(req.url,true).query
           const lat = query.lat
           const long = query.lng
           const coordinates = `${lat},${long}`
           
       const apiRes = await needle('get', `${GOOGLE_API_URL}?latlng=${coordinates}&${GOOGLE_KEY_NAME}${GOOGLE_KEY_VALUE}`)
       const data = apiRes.body
       res.status(200).json(data)
   } catch (error) {
       res.status(500)
   }
    
})

router.get('/weather', async (req,res) =>{
    try {
        // `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${key}`
        const query = url.parse(req.url,true).query
        const latQuery = `lat=${query.lat}`
        const lonQuery = `lon=${query.lon}`
        

        const apiRes = await needle("get", `${OPENWEATHER_API_URL}?${latQuery}&${lonQuery}&units=imperial&${OPENWEATHER_KEY_NAME}${OPENWEATHER_KEY_VALUE}`)
        const data = apiRes.body
        console.log(data)
        res.status(200).json(data)
    } catch (error) {
        res.status(500)
        
    }
})

module.exports = router