const firebase = require("firebase-admin");

const appName = `a_${(new Date()).getTime()}`;

// Initialize the app with a service account, granting admin privileges
global[appName] = firebase.initializeApp({
  credential: firebase.credential.cert(JSON.parse(process.env.firebase_admin)),
  databaseURL: process.env.databaseURL,
}, appName);

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

  const db = global[appName].firestore();
  const docRef = db.collection(process.env.collection).doc(url);
  const doc = await docRef.get();
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
      return { statusCode: 200, body: JSON.stringify('You have already voted!') };
    }

    data.ratings[value].push(userIp);

    await docRef.set(data);
    console.log(JSON.stringify(res))
    return {
      statusCode: 200,
      body: JSON.stringify('Thank you! 🎉')
    };
  }
};
