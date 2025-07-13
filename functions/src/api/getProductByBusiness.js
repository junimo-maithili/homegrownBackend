import admin from 'firebase-admin';

const getProduct = async (req, res) => {
  const db = admin.firestore();

  const { businessName } = req.query;

  if (!businessName) {
    return res.status(400).send('No business name found');
  }

  try {
    const productRef = db.collection('products').doc(businessName);
    const doc = await productRef.get();

    if (!doc.exists) {
      return res.status(404).send('Product not found');
    }

    res.status(200).json(doc.data());
  } catch (error) {
    res.status(500).send('Error fetching product: ' + error.message);
  }
};

export default getProduct;