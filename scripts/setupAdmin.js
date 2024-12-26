const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setUserAsAdmin(email) {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    await db.collection('users').doc(userRecord.uid).update({
      role: 'admin',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`Successfully set user ${email} as admin`);
  } catch (error) {
    console.error('Error setting admin role:', error);
  }
}

// Usage: node setupAdmin.js user@example.com
const email = process.argv[2];
if (email) {
  setUserAsAdmin(email);
} else {
  console.error('Please provide an email address');
} 