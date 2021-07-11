const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios')

app.use(bodyParser.json());

const WEBHOOK_RECEIVE_ENDPOINT = '/webhook-receive';

app.get(WEBHOOK_RECEIVE_ENDPOINT, (request, response) => {
    const { url } = request;

    console.log("Received webhook request to /webhook-receive");
    console.log("Full URL: " + url);

    response.send({
        message: "Received GET request. Check the console for more info"
    });
});

app.post(WEBHOOK_RECEIVE_ENDPOINT, (request, response) => {
    const { body } = request;

    console.log("Received webhook request to /webhook-receive");
    console.log("Request body:");
    console.log(body);

    if (request.body.changes[0] && request.body.changes[0].type == "ADD" && request.body.changes[0].ref.type == "BRANCH") {
        console.log("New branch created: "+request.body.changes[0].refId)
        axios.post({
            url: 'https://bb.plium.club/rest/api/1.0/projects/plium/repos/core/branches',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+process.env.BITBUCKET_TOKEN
            },
            json: {
                "name" : "today","startPoint": "017cdd26426ea084dbe16f56c4d8993dfdc706d1"
            }
        }).then(res => {
            console.log(`statusCode: ${res.statusCode}`)
            console.log(res)
          })
          .catch(error => {
            console.error(error)
          })
    }

    response.send({
        message: "Received POST request. Check the console for more info"
    });
});

app.put(WEBHOOK_RECEIVE_ENDPOINT, (request, response) => {
    const { body } = request;

    console.log("Received webhook request to /webhook-receive");
    console.log("Request body: ");
    console.log(body);

    response.send({
        message: "Received PUT request. Check the console for more info"
    });
});

app.delete(WEBHOOK_RECEIVE_ENDPOINT, (request, response) => {
    const { url } = request;

    console.log("Received webhook request to /webhook-receive");
    console.log("Full URL: " + url);

    response.send({
        message: "Received DELETE request. Check the console for more info"
    });});

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));