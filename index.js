const express = require('express')
const app = express()

// calling googleapis
const {google} = require('googleapis')
require('dotenv').config();
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
const sheets =  google.sheets("v4");
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes:['https://www.googleapis.com/auth/spreadsheets']
})

async function accessGoogleSheet() {
    const authClient = await auth.getClient();
    const spreadsheetId = "1m4X9qXbJ7hLlY8p9H3FK8Go0_qwHi_8QDr_qFGpZzGc"
    const range = "Journal!A1:F"
    const response = await sheets.spreadsheets.values.get({
        auth: authClient,
        spreadsheetId,
        range
    })
    return(response.data.values)
}

app.get('/', async function (req, res) {
  const data = await accessGoogleSheet()
  res.send(data)
})

app.listen(3000)