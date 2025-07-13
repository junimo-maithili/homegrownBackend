import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import addProduct from "./api/addProduct.js";
import getProduct from './api/getProductByBusiness.js';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export const createProduct = functions.https.onRequest(addProduct);
export const findProductByBusiness = functions.https.onRequest(getProduct);

findProductByBusinessName('badApple').then(product => {
  console.log(product);
});