// importData.js
import { readFile } from "fs/promises";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = JSON.parse(
  await readFile("./serviceAccountKey.json", "utf-8")
);

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function importData() {
  try {
    const data = JSON.parse(await readFile("./allQuestions.json", "utf-8"));
    const batch = db.batch();

    data.forEach((q) => {
      // normalize type
      if (q.type && typeof q.type === "string") {
        q.type = q.type.trim().toLowerCase().replace(/[-\s]/g, "_");
      }
      const ref = db.collection("questions").doc();
      batch.set(ref, q);
    });

    await batch.commit();
    console.log("✅ Multilingual data imported successfully!");
  } catch (e) {
    console.error("❌ Import failed:", e);
  }
}

importData();
