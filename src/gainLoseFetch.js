import { Router } from 'express'
import axios from 'axios'
import cheerio from 'cheerio'

const router = Router()

// Global variables goes Here
const startUrl = "https://coinmarketcap.com/gainers-losers/"
let topGainers = []
let topLosers = []
const currKeys = [
    'rank',
    'name',
    'price',
    '24H',
    '24Hvolume',
]

// Get methods go here
// GET at /prices/
router.get('/', async (req, res) => { 
    try {
        const { data } = await axios(`${startUrl}`) // Fetch data to data object in HTML
        const $ = cheerio.load(data) // Creating cheerio selector $ by convetion

        // Get the wanted data for the Gainers
        const gainersRows = $('div.uikit-row:first-child > div.uikit-col-md-8 > div.sc-f7a61dda-2 > table > tbody > tr') 

        gainersRows.each( (parentIdx, parentElem) => {
            let currObj = {}         
            let keyIdx = 0 
            if (parentIdx < 7) {
                $(parentElem).children().each( (childIdx, childElem) => {
                    let tdValue = $(childElem).text()

                    if (keyIdx === 1) {
                        tdValue = $('p:first-child', $(childElem).html()).text()
                    }

                    if(tdValue) {
                        currObj[currKeys[keyIdx]] = tdValue
                        keyIdx++
                    }
                })
                topGainers.push(currObj)
            }
        })

        // Get the wanted data for the Gainers
            const losersRows = $('div.uikit-col-md-8:nth-child(2) > div.sc-f7a61dda-2 > table > tbody > tr') 

            losersRows.each( (parentIdx, parentElem) => {
                let currObj = {}         
                let keyIdx = 0 
                if (parentIdx < 10) {
                    $(parentElem).children().each( (childIdx, childElem) => {
                        let tdValue = $(childElem).text()
        
                        if (keyIdx === 1) {
                            tdValue = $('p:first-child', $(childElem).html()).text()
                        }
        
                        if(tdValue) {
                            currObj[currKeys[keyIdx]] = tdValue
                            keyIdx++
                        }
                    })
                    topLosers.push(currObj)
                }
            })

        // Send back the data
        res.status(200).json({
            headers: req.headers,
            baseUrl: startUrl,
            gainers: topGainers,
            losers: topLosers
        })

    } catch (err) {
        if (err) throw err
        res.status(400)
    }
})

export default router