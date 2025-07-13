import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import readline from "readline";

const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve("./serviceAccount.json"), "utf8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function addBusiness(business) {
  const { businessName, description, tags } = business;
  const businessRef = db.collection("businesses").doc(businessName);

  const doc = await businessRef.get();
  if (doc.exists) {
    console.log(`ℹ️ Business "${businessName}" already exists. Updating info...`);
    await businessRef.update({
      ...(description && { description }),
      ...(tags && { tags }),
    });
  } else {
    await businessRef.set({
      businessName,
      description,
      tags,
    });
    console.log(`✅ Created new business: ${businessName}`);
  }
}

async function addProduct(product) {
  const { businessName, productName, productPrice, productImage } = product;

  // Check that business exists
  const businessRef = db.collection("businesses").doc(businessName);
  const doc = await businessRef.get();
  if (!doc.exists) {
    console.error(`❌ Cannot add product. Business "${businessName}" does not exist.`);
    return;
  }

  // Add to flat products collection
  const flatRef = db.collection("products").doc(); // auto-ID
  await flatRef.set({
    businessName,
    productName,
    productPrice,
    productImage,
  });

  // Add to nested products collection under business
  const nestedRef = businessRef.collection("products").doc();
  await nestedRef.set({
    productName,
    productPrice,
    productImage,
  });

  console.log(`✅ Added product "${productName}" under business "${businessName}"`);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function interactiveAdd() {
  try {
    const type = await question("Add Business or Product? (b/p): ");
    if (type.toLowerCase() === "b") {
      const businessName = await question("Business name: ");
      const description = await question("Description: ");
      const tagsRaw = await question("Tags (comma separated): ");
      const tags = tagsRaw.split(",").map((tag) => tag.trim());
      await addBusiness({ businessName, description, tags });
    } else if (type.toLowerCase() === "p") {
      const businessName = await question("Business name for product: ");
      const productName = await question("Product name: ");
      const productPriceInput = await question("Product price: ");
      const productPrice = parseFloat(productPriceInput);
      if (isNaN(productPrice)) {
        console.error("❌ Invalid price entered.");
        rl.close();
        return;
      }
      const productImage = await question("Product image URL: ");
      await addProduct({ businessName, productName, productPrice, productImage });
    } else {
      console.log("Invalid option. Please choose 'b' or 'p'.");
    }
  } catch (err) {
    console.error(err);
  } finally {
    rl.close();
  }
}

(async () => {
  await interactiveAdd();
})();
