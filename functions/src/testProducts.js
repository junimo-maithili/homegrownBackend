import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import addProduct from './api/addProduct.js';
import express from 'express';

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'; 
process.env.GOOGLE_CLOUD_PROJECT = 'homegrown-backend';


const serviceAccount = JSON.parse(fs.readFileSync(path.resolve('./serviceAccount.json'), 'utf8'));


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}


async function add() {
  addProduct({
    businessName: "Edelgard",
    productName: "Seasons of Warfare", 
    productPrice: 29,
    productTags: ["cool", "catchy", "i knows all the lyrics"]
  });
}

// Function to test the query
async function testFindProductByName() {
  try {
    const db = admin.firestore();

    // Query to find certain product name in products collection
    const snapshot = await db.collection('products')
      .where('businessName', '==', 'badApple')
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

add();
//testFindProductByName();
