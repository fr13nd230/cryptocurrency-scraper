import { Router } from 'express'
import axios from 'axios'
import cheerio from 'cheerio'

const router = Router()

// Global variables goes Here
const startUrl = "https://coinmarketcap.com/nft"
let dataArray = []
const currKeys = [
    'rank',
    'nftName',
    '24Hvolume',
    'estimatedMarketCap',
    'floorPrice',
    'averagePrice',
    'sales',
    'assets',
    'owners',
    'owners(%)'
]

// Get methods go here
// GET at /prices/
router.get('/', async (req, res) => {
    try {
        const { data } = await axios(`${startUrl}`) // Fetch data to data object in HTML
        const $ = cheerio.load(data) // Creating cheerio selector $ by convetion

        // Get the wanted data
        const currencyRows = $('div.sc-f7a61dda-2:nth-child(3) > table:nth-child(1) > tbody:nth-child(3) > tr')

        currencyRows.each( (parentIdx, parentElem) => {
            let currObj = {}
            let keyIdx = 0
            if (parentIdx < 10) {
                $(parentElem).children().each( (childIdx, childElem) => {
                    let tdValue = $(childElem).text()

                    if(tdValue) {
                        currObj[currKeys[keyIdx]] = tdValue
                        keyIdx++
                    }
                })
                dataArray.push(currObj)
            }
        })

        // Send back the data
        res.status(200).json({
            headers: req.headers,
            baseUrl: startUrl,
            data: dataArray
        })

    } catch (err) {
        if (err) throw err
        res.status(400)
    }
})

export default router