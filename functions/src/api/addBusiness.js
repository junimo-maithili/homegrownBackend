import admin from 'firebase-admin';

export default async function addBusiness ({ businessName, businessTags })  {
  try {
    const db = admin.firestore();
    const cleanBusinessName = businessName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

    const businessRef = db.collection('businesses').doc(businessName).set({ businessName, businessTags });

  } catch (error) {
    console.error("Error adding business.");
    console.error(error);
  }
};

