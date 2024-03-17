const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Connection URI
const uri = "YOUR URI HERE";
// Database Name
const dbName = 'test';
// Collection Name for food items
const foodItemsCollection = 'food_items';

// Create a new MongoClient
const client = new MongoClient(uri);

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function testConnection() {
    try {
        // Connect the client to the server
        await client.connect();

        console.log('Connected successfully to server');
        return true;
    } catch (err) {
        console.log('Error occurred:', err);
        return false;
    } finally {
        // Close the client
        await client.close();
        console.log('Connection closed');
    }
}

async function insertFoodItem(item) {
    try {
        // Connect the client to the server
        await client.connect();

        console.log('Connected successfully to server');

        // Select the database
        const db = client.db(dbName);

        // Insert new food item into the collection
        await db.collection(foodItemsCollection).insertOne(item);

        console.log('Food item added successfully');
        return true;
    } catch (err) {
        console.log('Error occurred:', err);
        return false;
    } finally {
        // Close the client
        await client.close();
        console.log('Connection closed');
    }
}

async function getFoodItems() {
    try {
        // Connect the client to the server
        await client.connect();

        console.log('Connected successfully to server');

        // Select the database
        const db = client.db(dbName);

        // Retrieve all food items from the collection
        const items = await db.collection(foodItemsCollection).find().toArray();

        console.log('Food items retrieved successfully');
        return items;
    } catch (err) {
        console.log('Error occurred:', err);
        return [];
    } finally {
        // Close the client
        await client.close();
        console.log('Connection closed');
    }
}

async function removeFoodItem(name) {
    try {
        // Connect the client to the server
        await client.connect();

        console.log('Connected successfully to server');

        // Select the database
        const db = client.db(dbName);

        // Remove food item from the collection
        const result = await db.collection(foodItemsCollection).deleteOne({ name });

        console.log('Food item removed successfully');
        return result.deletedCount === 1;
    } catch (err) {
        console.log('Error occurred:', err);
        return false;
    } finally {
        // Close the client
        await client.close();
        console.log('Connection closed');
    }
}

app.get('/', async (req, res) => {
    await testConnection();
    res.send(`
        <html>
            <head>
                <title>Food Menu</title>
            </head>
            <body>
                <h1>Food Menu</h1>
                <form action="/add_food_item" method="post">
                    <h2>Add Food Item</h2>
                    <input type="text" name="name" placeholder="Name" required>
                    <input type="number" name="price" step="0.01" placeholder="Price" required>
                    <button type="submit">Add Item</button>
                </form>
                <h2>Menu</h2>
                <ul>
                    ${await generateFoodItemsList()}
                </ul>
                <form action="/remove_food_item" method="post">
                    <h2>Remove Food Item</h2>
                    <input type="text" name="name" placeholder="Name" required>
                    <button type="submit">Remove Item</button>
                </form>
            </body>
        </html>
    `);
});

async function generateFoodItemsList() {
    const items = await getFoodItems();
    return items.map(item => `<li>${item.name} - $${item.price.toFixed(2)}</li>`).join('');
}

app.post('/add_food_item', async (req, res) => {
    const { name, price } = req.body;
    const result = await insertFoodItem({ name, price: parseFloat(price) });
    if (result) {
        res.redirect('/');
    } else {
        res.status(500).send('Failed to add food item');
    }
});

app.post('/remove_food_item', async (req, res) => {
    const { name } = req.body;
    const result = await removeFoodItem(name);
    if (result) {
        res.redirect('/');
    } else {
        res.status(500).send('Failed to remove food item');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
