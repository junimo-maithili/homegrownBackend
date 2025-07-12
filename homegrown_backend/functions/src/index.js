import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import addProduct from "./api/addProduct.js";

// Initialize Firebase admin SDK first
if (!admin.apps.length) {
  admin.initializeApp();
}

// Now that Firebase Admin is initialized, you can use Firestore.
const db = admin.firestore();

// Export the Cloud Function
export const createProduct = functions.https.onRequest(addProduct);
