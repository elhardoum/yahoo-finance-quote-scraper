(async () =>
{
  const { GoogleSpreadsheet } = require('google-spreadsheet')
      , creds = require('./service_account.json')
      , { GOOGLE_SHEET_ID, CELLS_RANGE } = require('./config')
      , doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID)
      , [ ticker_cell, price_cell ] = CELLS_RANGE.split(':')

  await doc.useServiceAccountAuth(creds)
  await doc.loadInfo()

  const sheet = doc.sheetsByIndex[0]
  await sheet.loadCells(CELLS_RANGE)

  for ( let i=+ticker_cell.replace(/[^\d]+/g, ''); i<+price_cell.replace(/[^\d]+/g, ''); i++ ) {
    const cell = await sheet.getCellByA1(`${price_cell.replace(/[\d]+/g, '')}${i}`)
        , uval = cell._rawData.userEnteredValue
        , ticker = ((await sheet.getCellByA1(`${ticker_cell.replace(/[\d]+/g, '')}${i}`))._rawData.userEnteredValue||{}).stringValue

    if ( ! ticker || /\s/.test(ticker) )
      continue

    cell.formula = `=GOOGLEFINANCE(${ticker_cell.replace(/[\d]+/g, '')}$${i}, "price")`
    sheet.saveUpdatedCells()
  }
})()
