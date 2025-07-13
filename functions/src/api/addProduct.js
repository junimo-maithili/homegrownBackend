import admin from 'firebase-admin';

export default async function addProduct ({ businessName, productName, productPrice, productTags })  {
  try {
    const db = admin.firestore();
    const productRef = await db.collection('products').add({businessName, productName, productPrice, productTags})

  } catch (error) {
    console.error("Error adding product.");
    console.error(error);
  }
};
