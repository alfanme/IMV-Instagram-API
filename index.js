require('dotenv').config();
const express = require('express');
const app = express();

let port = process.env.PORT;
if (port == null || port == '') {
    port = 8000;
}

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
