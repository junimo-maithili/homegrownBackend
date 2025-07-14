import admin from 'firebase-admin';


export default async function addNewUser({ userUID, name, email }) {
  try {const db = admin.firestore();

  const customerData = {
    userUID,
    name,
    email,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('users').doc(userUID).set(customerData);
  
  console.log('Customer created with ID:', userUID);
} catch(error) {
  console.log(error);
}
}
