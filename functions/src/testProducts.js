import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import addProduct from './api/addProduct.js';
import express from 'express';
import addBusiness from './api/addBusiness.js';

process.env.GOOGLE_CLOUD_PROJECT = 'homegrown-backend';


const serviceAccount = JSON.parse(fs.readFileSync(path.resolve('./serviceAccount.json'), 'utf8'));


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}


async function add() {
  addBusiness({
    businessName: "Dimitri",
    businessTags: ["cool", "catchy", "NOT DAINSLEIF"]
  });
}

async function addProd() {
  addProduct({
    businessName: "Dimitri",
    productName: "orange",
    productPrice: 5.99
  });
}

// Function to test the query
async function testFindProductByName() {
  try {
    const db = admin.firestore();
    const businessName = "Seasons of Warfare";

    // Query to find certain product name in products collection
    const cleanBusinessName = businessName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
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

addProd();
//testFindProductByName();
