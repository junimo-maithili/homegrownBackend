import admin from 'firebase-admin';

export default async function updateTags({ userUID, businessName }) {
  try {
    const db = admin.firestore();
    const cleanBusinessName = businessName.replace(/[^a-zA0-9]/g, '_').toLowerCase();

    // Get business and its tags
    let busiTags = {};
    const getBusiness = await db.collection('businesses')
      .where('businessName', '==', businessName)
      .get();

    if (!getBusiness.empty) {
      const doc = getBusiness.docs[0];
      const data = doc.data();
      console.log(data.description);
      busiTags = doc.data().businessTags || [];

    } else {
      console.log("Business not found");
    }


    // Get user's tags
    const getUser = await db.collection('users')
      .where('uid', '==', userUID)
      .get();

    if (!getUser.empty) {
      const doc2 = getUser.docs[0];
      const data2 = doc2.data();

      // Initialize userTags as an object or default to an empty object if not found
      let userTags = data2.tags || {};  // If no tags, use an empty object

      // Traverse through business tags, update based on user tags
      for (let i = 0; i < busiTags.length; i++) {
        if (userTags[busiTags[i]]) {
          // If tag is found, add one to count
          userTags[busiTags[i]] += 1;

        } else {
          // Add a new tag
          userTags[busiTags[i]] = 1;
        }
      };

      // Update database
      const userRef = db.collection('users').doc(userUID);
      await userRef.update({ tags: userTags });
      console.log("Updated user tags:", userTags);

    } else {
      // User does not have tags, make some
      const customerData = { tags: busiTags };  // Initialize with business tags
      const userRef = db.collection('users').doc(userUID);
      await userRef.set(customerData);
      console.log("Created new user tags:", customerData);
    }

  } catch (error) {
    console.log(error);
  }
}
