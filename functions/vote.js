const admin = require("firebase-admin");

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST" || !event.body) {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const params = JSON.parse(event.body);
  let url = params.url || false;
  const userIp = params.userIp || false;
  const value = params.value || false;

  if (!url || !userIp || !value) {
    return { statusCode: 405, body: "Missing arguments" };
  }

  url = (Buffer.from(url)).toString('base64');

  // Initialize the app with a service account, granting admin privileges
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.firebase_admin)),
    databaseURL: process.env.databaseURL,
  });

  const db = admin.firestore();
  const cityRef = db.collection(process.env.collection).doc(url);
  const doc = await cityRef.get();
  if (!doc.exists) {
    return { statusCode: 500, body: "No data" };
  } else {
    return { statusCode: 200, body: JSON.stringify(doc.data()) };
  }

  return {
    statusCode: 200,
    body: `Hello, url: ${url} , userIp: ${userIp} , value: ${value}`
  };
};
