require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let port = process.env.PORT || 3000;

const domainsFromEnv = process.env.CORS_DOMAINS || '';
const whitelist = domainsFromEnv.split(',').map(item => item.trim());

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));

const checkFollower = require('./checkFollower');

app.get('/username/:username', async (req, res) => {
    console.log(req.params.username);
    const result = await checkFollower(req.params.username);
    await res.json(result);
});

app.get('/', (req, res) => {
    res.send(
        'Hello there! This is IMV Laboratory Instagram follower checker API'
    );
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
