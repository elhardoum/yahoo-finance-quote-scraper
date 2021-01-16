(async () =>
{
  const { GoogleSpreadsheet } = require('google-spreadsheet')
      , creds = require('./service_account.json')
      , { GOOGLE_SHEET_ID, CELLS_RANGE, QUOTE_REFRESH_MS } = require('./config')
      , doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID)
      , [ ticker_cell, price_cell ] = CELLS_RANGE.split(':')

  await doc.useServiceAccountAuth(creds)
  await doc.loadInfo()

  while( true ) {
    const sheet = doc.sheetsByIndex[0]
    await sheet.loadCells(CELLS_RANGE)

    for ( let i=+ticker_cell.replace(/[^\d]+/g, ''); i<+price_cell.replace(/[^\d]+/g, ''); i++ ) {
      const cell = await sheet.getCellByA1(`${price_cell.replace(/[\d]+/g, '')}${i}`)
          , uval = cell._rawData.userEnteredValue
          , ticker = ((await sheet.getCellByA1(`${ticker_cell.replace(/[\d]+/g, '')}${i}`))._rawData.userEnteredValue||{}).stringValue

      if ( ! ticker || /\s/.test(ticker) )
        continue

      let yticker = ticker

      // if you use other exchange stocks like CVE, make sure to add a separate col for formatting yahoo ticker
      // e.g googlefinance recognizes the format CVE:TICKER while yahoo takes TICKER.V for that.
      // or comment out below lines and replace exchange/code accordingly
      // if ( /^cve\:/i.test(yticker) ) {
      //   yticker = `${yticker.replace(/^cve\:/i, '')}.V`
      // }

      YahooFinanceScrapeQuote(yticker)
        .then(price =>
        {
          if ( price ) {
            cell.value = price
            sheet.saveUpdatedCells()
          }
        })
    }

    // delay next refresh
    await new Promise(resolve => setTimeout(resolve, QUOTE_REFRESH_MS))
  }
})()

const YahooFinanceScrapeQuote = async (ticker) =>
{
  const html = await require('node-fetch')(`https://finance.yahoo.com/quote/${ticker}`)
    .then(r => r.text()).catch(err => void console.log(err))

  try {
    return +String(html)
      .match(new RegExp('"currentPrice":{"raw":[0-9]+(\.[0-9]+)?', 'g'))[0]
      .match(/\d+/g).join('.')
  } catch (err) {
    console.log(err)
  }
}