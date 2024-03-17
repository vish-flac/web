const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://dummyuser:dummyuser123@cluster0.qdu2zef.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Database Name
const dbName = 'test';

// Create a new MongoClient
const client = new MongoClient(uri);

async function testConnection() {
  try {
    // Connect the client to the server
    await client.connect();

    console.log('Connected successfully to server');

    // Select the database
    const db = client.db(dbName);

    // List all the collections in the database
    const collections = await db.listCollections().toArray();

    console.log('Collections:');
    collections.forEach(collection => console.log(collection.name));

  } catch (err) {
    console.log('Error occurred:', err);
  } finally {
    // Close the client
    await client.close();
    console.log('Connection closed');
  }
}

// Call the function to test the connection
testConnection();
