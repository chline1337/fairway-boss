// server/config/db.js
const { MongoClient } = require('mongodb');

let db; // Holds our database instance

async function connectDB(uri) {
    if (!uri) {
        throw new Error('No MongoDB URI provided');
    }
    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
        throw new Error(`Invalid MongoDB URI format: ${uri}`);
    }

    const client = new MongoClient(uri);
    await client.connect();
    db = client.db('fairwayboss');
    console.log('Connected to MongoDB');

    return db;
}

function getDB() {
    if (!db) {
        throw new Error('Database not connected yet. Please call connectDB first.');
    }
    return db;
}

module.exports = { connectDB, getDB };
