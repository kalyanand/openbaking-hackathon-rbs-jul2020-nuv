const express = require('express');
const {getAccounts, getTransactions} = require('./api');
const ConfigError = require('./config-error');
const config = require('./config.json');
const {generateMoratorium, generateOffers, generateSummary, generateTop5, generateInsight} = require('./narrativeInsights');
let authToken = undefined;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>welcome to node api for hackathon open banking 2020 - RBS (Cyber Renderer @ dpcyberr)</h1>');
});

app.get('/api/cust', async (req, res) => {
    res.send(config.customerNumber);
});

app.get('/api/accounts', async (req, res) => {
    try {
        console.log('auth token from ob api', authToken);
        const accounts = await getAccounts(authToken);
        console.log('accounts are', accounts);
        res.send(accounts);
    } catch (error) {
        if (error instanceof ConfigError)
            console.log('Configuration error: ', error.message);
        else
            throw error;
    }
});
app.get('/api/summary', async (req, res) => {
    res.send(generateSummary())
});
app.get('/api/moratorium', async (req, res) => {
    res.send(generateMoratorium())
});
app.get('/api/top5', async (req, res) => {
    res.send(generateTop5())
});
app.get('/api/offers', async (req, res) => {
    res.send(generateOffers())
});

app.get('/api/transactions/:page/:accountId', async (req, res) => {
    try {
        console.log('auth token from ob api', authToken, req.params);
        const transactions = await getTransactions(authToken, req.params.page, req.params.accountId);
        // console.log('accounts are', transactions);
        res.send(transactions);
    } catch (error) {
        if (error instanceof ConfigError)
            console.log('Configuration error: ', error.message);
        else
            throw error;
    }
});

app.get('/api/insight/:accountId', async (req, res) => {
    try {
        let accTransId = req.params.accountId;
        const transactions = await getTransactions(authToken, '*', accTransId);
        res.send(generateInsight(transactions,accTransId));
    } catch (error) {
        if (error instanceof ConfigError)
            console.log('Configuration error: ', error.message);
        else
            throw error;
    }
});

const startServer = function (authorisedAccessToken) {
    authToken = authorisedAccessToken;
    const port = process.env.PORT || 6200;
    app.listen(port, () => console.log(`Listening on port ${port}..`));

}

module.exports = {
    startServer
}