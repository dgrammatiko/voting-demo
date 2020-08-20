exports.handler = (event, context, callback) => {
    console.log(JSON.stringify(event))
    console.log(JSON.stringify(context))

    if (event.httpMethod.toUpperCase() !== 'POST' || !event.body) {
        callback(null, {
            statusCode: 500,
            message: 'Server Error',
        });
    }
}
