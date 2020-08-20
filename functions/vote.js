const faunadb = require('faunadb');

exports.handler = async (event, context) => {
    // Only allow POST
    if (event.httpMethod !== "POST" || !event.body) {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Make sure we have the needed env variables
    if (!process.env.FAUNADB_SECRET) {
        return { statusCode: 405, body: "Misconfigured Server" };
    }

    const params = JSON.parse(event.body);
    let url = params.url || false;
    const userIp = params.userIp || false;
    const value = params.value || false;

    if (!url || !userIp || !value) {
        return { statusCode: 405, body: "Missing arguments" };
    }

    url = new URL(url);
    url = url.pathname.replace(/\//g, '-');

    if (url === '-') {
        url = 'home';
    }

    const q = faunadb.query;
    const client = new faunadb.Client({
        secret: process.env.FAUNADB_SECRET
    });

    let data;
    try {
        data = await client.query(
            q.Map(
                q.Paginate(Documents(Collection(url))),
                q.Lambda(x => q.Get(x))
            ));
    } catch (e) {
        return { statusCode: 500, body: "Misconfigured DB" };
    }

    if (!data) {
        return { statusCode: 500, body: "No data" };
    } else {
        // return { statusCode: 200, body: JSON.stringify(data) };
    }


    return {
        statusCode: 200,
        body: `Hello, url: ${url} , userIp: ${userIp} , value: ${value}`
    };
};
