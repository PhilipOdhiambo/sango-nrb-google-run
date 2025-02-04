const express = require('express')
const app = express()

// Get secret
async function getSecret() {
  const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({
      name: 'projects/sango-nairobi/secrets/sango-nrb-googlesheet-key/versions/latest',
    });
  return version.payload.data.toString();
}


// calling googleapis
async function accessGoogleSheet() {
  const {google} = require('googleapis')
  const sheets =  google.sheets("v4");
  const spreadsheetId = "1m4X9qXbJ7hLlY8p9H3FK8Go0_qwHi_8QDr_qFGpZzGc"
  const range = "Journal!A1:F"
  const config = JSON.parse(await getSecret());

  const auth = new google.auth.GoogleAuth({
    credentials:config,
    scopes:['https://www.googleapis.com/auth/spreadsheets']
  })

  const authClient = await auth.getClient();
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