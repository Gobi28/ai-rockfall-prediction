const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const sourceUri =
  process.env.SOURCE_MONGO_URI ||
  "mongodb://127.0.0.1:27017/ai_mine_prediction";
const targetUri = process.env.MONGO_URI;

if (!targetUri) {
  throw new Error("MONGO_URI must contain the cloud MongoDB connection string");
}

const copyCollection = async (sourceDb, targetDb, collectionName) => {
  const documents = await sourceDb
    .collection(collectionName)
    .find({})
    .toArray();

  if (!documents.length) {
    console.log(`${collectionName}: no source documents`);
    return;
  }

  await targetDb.collection(collectionName).bulkWrite(
    documents.map((document) => ({
      replaceOne: {
        filter: { _id: document._id },
        replacement: document,
        upsert: true,
      },
    })),
    { ordered: false },
  );

  console.log(`${collectionName}: migrated ${documents.length} documents`);
};

const migrate = async () => {
  const source = await mongoose.createConnection(sourceUri).asPromise();
  const target = await mongoose.createConnection(targetUri).asPromise();

  try {
    await copyCollection(source.db, target.db, "predictions");
    await copyCollection(source.db, target.db, "alerts");
  } finally {
    await source.close();
    await target.close();
  }
};

migrate().catch((error) => {
  console.error(`Migration failed: ${error.message}`);
  process.exit(1);
});
