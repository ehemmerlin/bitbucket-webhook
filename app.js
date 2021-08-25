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
        message: "Received GET request. Check the console for more info."
    });
});

app.post(WEBHOOK_RECEIVE_ENDPOINT, (request, response) => {
    const { body } = request;

    console.log("Received webhook request to /webhook-receive");
    console.log("Request body:");
    console.log(body);

    if (request.body.changes[0] && request.body.changes[0].type == "ADD" && request.body.changes[0].ref.type == "BRANCH") {
        console.log("New branch created: "+request.body.changes[0].refId)

        const refId = request.body.changes[0].refId;
        const branch = refId.split('/')[2];

        let headerGet = {
            headers: {
                'Authorization': 'Bearer ' + process.env.BITBUCKET_TOKEN
            }
          };
    
        axios.get('http://bitbucket.plium.club:7990/rest/api/1.0/projects/PIL/repos/core/commits?until=master', headerGet)
        .then(res => {
            console.log(res)

            let lastCommit = res.data.values[0].id;
            console.log("Last commit: " + lastCommit)

            var data = {
                name: branch,
                startPoint: lastCommit
              };
              
            let headerPost = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + process.env.BITBUCKET_TOKEN
                }
              };
    
            axios.post('http://bitbucket.plium.club:7990/rest/api/1.0/projects/PIL/repos/core/branches', data, headerPost)
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.error(error.response)
            })

        })
        .catch(error => {
            console.error(error.response)
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
