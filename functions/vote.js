const admin = require("firebase-admin");
// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.firebase_admin)),
  databaseURL: process.env.databaseURL,
}, `a_${(new Date()).getTime()}`);

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

  const emptyData = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  };

  const db = admin.firestore();
  const cityRef = db.collection(process.env.collection).doc(url);
  const doc = await cityRef.get();
  let data;

  console.log(JSON.stringify(doc.data()))
  if (!doc.exists) {
    data.ratings = emptyData;
    data.ratings[value].push(userIp)
  } else {
    data = doc.data();
    if (!data.ratings) {
      data.ratings = emptyData;
    }

    let alreadyVoted = false;
    for (const [key, value] of Object.entries(data.ratings)) {
      if (value.includes(userIp)) {
        alreadyVoted = true;
      }
    }

    if (alreadyVoted) {
      return { statusCode: 200, body: 'You have already voted!' };
    }

    data.ratings[value].push(userIp);

    const res = await db.collection(process.env.collection).doc(url).set(data);
    console.log(JSON.stringify(res))
    return {
      statusCode: 200,
      body: `Hello, url: ${url} , userIp: ${userIp} , value: ${value}`
    };
  }
};
