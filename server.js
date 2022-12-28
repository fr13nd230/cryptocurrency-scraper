import express , { json , urlencoded } from 'express'
import helmet from 'helmet'
import { config } from 'dotenv'

// Src imports
import priceFetch from './src/priceFetch.js'
import exchangesFetch from './src/exchangesFetch.js'
import gainLoseFetch from './src/gainLoseFetch.js'
import nftFetch from './src/nftFetch.js'

// Starting app
const app = express()

/* 
[this part of code here was temporary and i left it here just in case we need it in future]
[this code creates storage folder so we can save incoming responses as json files just to save]
const path = './storage'
fs.access(path, err => {
    if (err) {
        fs.mkdir(path, { recursive: true }, err => {
            if (err) {
                console.error(err)
            }
            else {
                console.log('Created Storage Folder!')
            }
        })
    }
    else {
        console.error('Folder already exists!')
    }
})
*/

// Configs
config()

// Global vars
const port = process.env.PORT || 2000

// Middlewares
app.use(helmet())
app.use(json())
app.use(urlencoded({ extended: false}))

// Setting views static folder
app.use(express.static('views'))

// Main get
app.get('/', (req, res) => { res.render('./views/index.html') })
// Other routes
app.use('/prices/', priceFetch)
app.use('/exchanges/', exchangesFetch)
app.use('/gain-lose/', gainLoseFetch)
app.use('/nft/', nftFetch)

// Listening
app.listen(port, () => console.log(`OK[port:${port}]`))