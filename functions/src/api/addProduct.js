import admin from 'firebase-admin';

export default async function addProduct ({ businessName, productName, productPrice })  {
  try {
    
    const db = admin.firestore();
    const cleanBusinessName = businessName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const cleanProductName = productName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    console.log("AHHHHHH: ", cleanBusinessName)

    const snapshot = await db.collection('products')
      .where('productName', '==', 'Seasons of Warfare')
      .get();

    if (!snapshot) {
      console.error("Business doesn't exist");
      return;
    } else {
      console.log("EXISTS!!");
    const businessRef = db.collection('businesses').doc(cleanBusinessName);
    const productData = { businessName, productName, productPrice };

    const productInBusiness = await businessRef.collection('products').add(productData);
    
    const productRef = db.collection('products');
    const addProduct = await productRef.doc(cleanProductName).set(productData);
  
    }

  } catch (error) {
    console.error("Error adding product.");
    console.error(error);
  }
};


async function testFindProductByName() {
  try {

    // Query to find certain product name in products collection
    const snapshot = await db.collection('products')
      .where('productName', '==', 'Seasons of Warfare')
      .get();

    // Check if the query found anything
    if (snapshot.empty) {
      console.log('Product not found');
    } else {
      snapshot.forEach(doc => {
        console.log('Found product:', doc.id, doc.data());
      });
    }
  } catch (error) {
    console.error('Error querying products:', error);
  }
}