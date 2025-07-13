import admin from 'firebase-admin';

const addProduct = async (req, res) => {
  try {
    const db = admin.firestore();

    const { businessName, productName, productPrice, tags } = req.body;
    const productRef = db.collection('products').doc(businessName);

    await productRef.set({ businessName, productName, productPrice, tags });

    res.status(200).send('Product added successfully');
  } catch (error) {
    res.status(500).send('Error adding product: ' + error.message);
  }
};

export default addProduct;
