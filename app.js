const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios')
const { Client } = require('pg');

app.use(bodyParser.json());

const WEBHOOK_RECEIVE_ENDPOINT = '/webhook-receive';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

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
    
        client.query("SELECT dependencies.url FROM repositories INNER JOIN dependencies ON repositories.id = dependencies.repository_id WHERE repositories.name='"+request.body.repository.slug+"';", (err, res) => {
            if (err) throw err;
                for (let row of res.rows) {
                    console.log(JSON.stringify(row));
    
                    axios.get('http://bitbucket.plium.club:7990/rest/api/1.0/projects/'+row.url+'/commits?until=master', headerGet)
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

                        axios.post('http://bitbucket.plium.club:7990/rest/api/1.0/projects/'+row.url+'/branches', data, headerPost)
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
            client.end();
        });

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
