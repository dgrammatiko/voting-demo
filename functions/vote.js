const querystring = require("querystring");
const fetch = require("node-fetch");

const API_ENDPOINT = "https://icanhazdadjoke.com/";

// const { FaunaKey } = process.env;

exports.handler = async (event, context) => {
    console.log(JSON.stringify(event))
    console.log(JSON.stringify(context))
    // Only allow POST
    if (event.httpMethod !== "POST" || !event.body) {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // When the method is POST, the name will no longer be in the event’s
    // queryStringParameters – it’ll be in the event body encoded as a query string
    console.dir(event.body)
    const params = JSON.parse(event.body);
    const url = params.url || false;
    const userIp = params.userIp || false;
    const value = params.value || false;

    if (!url || !userIp || !value) {
        return { statusCode: 405, body: "Missing arguments" };
    }

    // {
    //     url: location.href,
    //         userIp: window.currentIp.ip,
    //             value: this.value
    // }
    // return fetch(API_ENDPOINT, { headers: { "Accept": "application/json" } })
    //     .then(response => response.json())
    //     .then(data => ({
    //         statusCode: 200,
    //         body: data.joke
    //     }))
    //     .catch(error => ({ statusCode: 422, body: String(error) }));

    return {
        statusCode: 200,
        body: `Hello, url: ${url} , userIp: ${userIp} , value: ${value}`
    };
};
