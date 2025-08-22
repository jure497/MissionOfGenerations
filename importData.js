// importData.js

// Import specific functions from their respective sub-modules within firebase-admin
import { initializeApp, cert } from 'firebase-admin/app'; // For initializing the app and creating credentials
import { getFirestore } from 'firebase-admin/firestore'; // For getting the Firestore database instance
import { readFile } from 'fs/promises'; // Node.js file system promises API for reading files

// Define paths to your JSON files
const serviceAccountKeyPath = './serviceAccountKey.json'; // Path to your downloaded service account key
const allQuestionsDataPath = './allQuestions.json'; // Path to your JSON data file with questions

let serviceAccount; // Will hold the parsed service account JSON
let jsonData;       // Will hold the parsed questions JSON data

/**
 * Reads the necessary JSON files and initializes the Firebase Admin SDK.
 */
async function setupFirebaseAndData() {
  try {
    // Read the service account key file content and parse it
    const serviceAccountContent = await readFile(serviceAccountKeyPath, 'utf8');
    serviceAccount = JSON.parse(serviceAccountContent);

    // Read your questions data file content and parse it
    const allQuestionsContent = await readFile(allQuestionsDataPath, 'utf8');
    jsonData = JSON.parse(allQuestionsContent);

    // Initialize Firebase Admin SDK using the imported initializeApp and cert functions
    initializeApp({
      credential: cert(serviceAccount) // Use the 'cert' function directly
    });

    console.log('Firebase Admin SDK initialized and data loaded successfully.');
  } catch (error) {
    console.error('Failed to set up Firebase or load data:', error);
    // Provide more specific feedback if a file wasn't found or was invalid JSON
    if (error.code === 'ENOENT') {
      console.error(`Error: File not found. Please check paths for '${serviceAccountKeyPath}' or '${allQuestionsDataPath}'.`);
    } else if (error instanceof SyntaxError) {
      console.error('Error: Invalid JSON in one of the files. Please check the JSON format.');
    }
    process.exit(1); // Exit the script if setup fails
  }
}

let db; // Declare db globally so it can be used after initialization

/**
 * Imports data from the JSON file into the specified Firestore collection.
 */
async function importData() {
  await setupFirebaseAndData(); // First, set up Firebase and load data

  // Now that the app is initialized, get the Firestore instance using getFirestore
  db = getFirestore();

  const collectionRef = db.collection('questions'); // Target the 'questions' collection

  try {
    if (Array.isArray(jsonData)) {
      // If your JSON file contains an array of objects (e.g., a list of questions)
      for (const item of jsonData) {
        await collectionRef.add(item); // Add each object as a new document with an auto-generated ID
        console.log(`Added document to 'questions' collection: ${JSON.stringify(item)}`);
      }
    } else if (typeof jsonData === 'object' && jsonData !== null) {
      // If your JSON file contains a single object (e.g., a single large question object)
      await collectionRef.add(jsonData); // Add the single object as one document
      console.log(`Added single document to 'questions' collection: ${JSON.stringify(jsonData)}`);
    } else {
      console.error("JSON data is not an array or a valid object. Cannot import.");
      return; // Exit if data format is unexpected
    }

    console.log('\n✨ Data import complete! Check your Firestore console. ✨');
  } catch (error) {
    console.error('🚫 Error importing data:', error);
  } finally {
    process.exit(); // Ensure the script exits cleanly
  }
}

// Kick off the import process
importData();
