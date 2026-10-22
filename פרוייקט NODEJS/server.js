const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const path = require('path');
const recipes = require('./Routs/recipes.rout');
const customers = require('./Routs/customers.rout');
const restaurant = require('./Routs/restaurants.rout');
const products = require('./Routs/products.rout');
const forum = require('./Routs/forum.rout');

const host_name = process.env.HOST_NAME || '127.0.0.1';
const port = process.env.PORT;
app.use(cors()); // חשוב אם הלקוח בריאקט על פורט אחר
app.use(express.json()); // לפרוס JSON בבקשות POST

// כדי לשרת את התמונות מתיקיית uploads בכתובת /image/
app.use('/image', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());

app.use('/api/customers', customers);
app.use('/api/recipes', recipes);
app.use('/api/restaurants', restaurant);
app.use('/api/products', products);
app.use('/api/forum', forum);


app.use('/image', express.static(path.join(__dirname,'image')));




app.listen(port, host_name, () => {
        console.log(`server is up in address http://${host_name}:${port}`);

});
