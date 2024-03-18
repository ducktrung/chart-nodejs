const express = require('express')
const morgan = require('morgan');
const cors = require('cors')
const bodyParser = require('body-parser')

const fetchDataForRange = require('./api/controllers/fetchDataController')


const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Cho phép truy cập từ tất cả các origin
    next();
  });


app.use('/assets', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"))

app.get('/weather', async(req, res) => {
    try {
        const response = await fetchDataForRange(1950, 2020)
        res.json(response)
    }

    catch(error) {
        console.log('Error: ' + error.message)
    }
})



app.listen(port, () => {
    console.log('Server listening on port: ' + port)
})