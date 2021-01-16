# Yahoo Finance Quote Scraper

Tired of `GOOGLEFINANCE` being 20+ minutes delayed? and other free stocks quote APIs asking for money to get realtime quotes? Well, the aim of this project is to scrape Yahoo Finance for real-time quotes, and update your Google sheets.

## Install

### NPM Packages

First install the required modules:

```shell
npm install
```

### Spreadsheet

First, you need to clone the [sample spreadsheet](https://docs.google.com/spreadsheets/d/1pVKDWpbQ5LIIJdBZq8VkpRXBSgYv16XzEvHFMGqxpQI/edit#gid=0), `File > Make a copy`.

Then, open `config.js` and place your new sheet ID into `GOOGLE_SHEET_ID` value.

### Google Cloud Service Accounts

You need to create a service account: https://console.cloud.google.com/projectcreate

In your created project dashboard, search and enable both Google Sheets and Google Drive APIs.

Next, in credentials tab create a new service account, fill in the required information, click the created service account and add a new key, make sure the format selected is JSON.

Save the key as `service_account.json` in this project root (i.e same folder where `config.js` is located).

Now as a last step, make sure to go back to the spreadsheet, and share with your service account email (`client_email` in `service_account.json`). The role should be Editor.

## Usage

### Run the quote scraper

```shell
node scrape.js
```

It will check for quotes every 1 minute (can be changed in the config).

Depending on your requirements, you may want to run the refresh script periodically when watching the sheet or doing analysis. However, you are free to also increase the refresh interval in the config, use proxies etc to prevent Yahoo blocking your scraper in case it happens.

### Restoring GOOGLEFINANCE formula

Finally, when you want to restore `GOOGLEFINANCE` formulas and had too many tickers or were lazy to do it, you can use the following script for that:

```shell
node restore_googlefinance_formula.js
```