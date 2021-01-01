const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const WEBHOOK_RECEIVE_ENDPOINT = '/webhook-receive';

app.get(WEBHOOK_RECEIVE_ENDPOINT, (request, response) => {
    const { url } = request;

    console.log("Received GET webhook request");
    console.log("Full URL: " + url);

    response.send("Received GET request. Check the console for more info");
});

app.post(WEBHOOK_RECEIVE_ENDPOINT, (request, response) => {
    const { body } = request;

    console.log("Received POST webhook request to /webhook-receive");
    console.log("Request body:");
    console.log(body);

    response.send("Received POST request. Check the console for more info");
});

app.put(WEBHOOK_RECEIVE_ENDPOINT, (request, response) => {
    const { body } = request;

    console.log("Received PUT webhook request to /webhook-receive");
    console.log("Request body: ");
    console.log(body);

    response.send("Received PUT request. Check the console for more info");
});

app.delete(WEBHOOK_RECEIVE_ENDPOINT, (request, response) => {
    const { url } = request;

    console.log("Received DELETE webhook request");
    console.log("Full URL: " + url);

    response.send("Received DELETE request. Check the console for more info");
});

app.listen(port, () => {
    console.log(`Polyglot webhook example server listening at http://localhost:${port}`);
});
