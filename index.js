const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('./user_model'); // Path to your user model
const CatModel = require('./category_model');
const ProductModel = require('./product_model');
const productRoute = require('./routes/product_routes')
const userRoute = require('./routes/user_routes')

const app = express();
const port = process.env.PORT || 5050;


//SETTING UP ROUTERS
//app.use('/products', productRoute);
app.use('/users', userRoute)

app.use(cors());
app.use(bodyParser.json());


//CONNECTING WITH DATABASE
const sequelize = new Sequelize('u432853459_giniebase', 'u432853459_hassaanzafar00', 'Alpha4277226*', {
    host: 'srv1365.hstgr.io',
    port: 3306,
    dialectOptions: {
      connectTimeout: 75000 // 75 seconds
    },
    dialect: 'mysql' // Change to 'postgres' if using PostgreSQL
});

sequelize.sync()
    .then(() => console.log('Database connected successfully Online'))
    .catch(err => console.error(err)
);



// Pass the sequelize instance to the model
const User = UserModel(sequelize);  
const Category = CatModel(sequelize);
const Product = ProductModel(sequelize);


//GET SOMETHING BY QUERY

app.get('/query', async (req, res) => {
  try {
    const { id } = req.query; // Extract query parameters from the request

    // Execute a raw SQL query
    const products = await Product.sequelize.query(
      'SELECT * FROM Products WHERE id = :id',
      {
        replacements: { id }, // Dynamically replace parameters
        type: Product.sequelize.QueryTypes.SELECT, // Specify query type
      }
    );

    res.json(products); // Send the results back to the client
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle errors gracefully
  }
});





////////////////////////////  PRODUCT ROUTES  ////////////////////////////

// // DELETE A PRODUCT

app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await Product.destroy({ where: { id } });

    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//UPDATE the price and stock OF THE PRODUCT

app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { price, stock,description,name,is_available,vendor_id,category_id,sub_category_id,brand } = req.body;
    const [updatedRows] = await Product.update({ price, stock, description, name, is_available,vendor_id,category_id,sub_category_id,brand }, { where: { id } });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.post('/products', async (req, res) => {
  //const {name,vendor_id} = req.body;
  const {name,vendor_id,category_id,sub_category_id,description,brand,price,image_url,stock,is_available} = req.body;

  //if(!name || !vendor_id){
  if(!name || !vendor_id || !category_id || !sub_category_id || !description || !brand || !price || !image_url || !stock || !is_available){
    console.log(res)
    return res.status(400).json({ message: 'Please provide all required fields' });
    
  }

  try {
    // Create a new Product
    //const newProduct = await Product.create({name, vendor_id})
    const newProduct = await Product.create({ name,vendor_id,category_id,sub_category_id,description,brand,price,image_url,stock,is_available });
    res.status(201).json({ message: 'Product added successfully', name: newProduct.name });
  } catch (err) {
    console.error('Error adding Product:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

app.get('/products', async (req, res) => {
  try {
    // Retrieve all users from the database
    const allProducts = await Product.findAll();
    if (allProducts.length === 0) {
      return res.status(404).json({ message: 'No Products found' });
    }    

    // Send the list of users as response
    res.status(200).json({ allProducts });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


























// USER REGISTERATION ROUTE
// app.post('/users', async (req, res) => {
//     const { name, mobile_number, password } = req.body;
  
//     if (!name || !mobile_number || !password) {
//       return res.status(400).json({ message: 'Please provide all required fields: name, mobile_number, password.' });
//     }
  
//     try {
//       // Check if mobile number is already taken
//       const existingUser = await User.findOne({ where: { mobile_number } });
//       if (existingUser) {
//         return res.status(400).json({ message: 'Mobile number already registered' });
//       }
  
//       // Create a new user
//       const newUser = await User.create({ name, mobile_number, password });
//       res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
//     } catch (err) {
//       console.error('Error registering user:', err);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
// });




// // GET ALL USERS

// app.get('/users', async (req, res) => {
//   try {
//     // Retrieve all users from the database
//     const users = await User.findAll();
//     if (users.length === 0) {
//       return res.status(404).json({ message: 'No users found' });
//     }

    

//     // Send the list of users as response
//     res.status(200).json({ users });
//   } catch (err) {
//     console.error('Error fetching users:', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });



// GET ALL PRODUCTS



// GET ALL CATEGEORIES

app.get('/categories', async (req, res) => {
  try {
    // Retrieve all users from the database
    const cates = await Category.findAll();
    if (cates.length === 0) {
      return res.status(404).json({ message: 'No Categories found' });
    }    

    // Send the list of users as response
    res.status(200).json({ cates });
  } catch (err) {
    console.error('Error fetching Categories:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// CATEGORY REGISTERATION ROUTE
app.post('/categories', async (req, res) => {
  const {name} = req.body;

  if(!name){
    return res.status(400).json({ message: 'Please provide a valid name for category' });
  }

  try {
    // Create a new category
    const newCategory = await Category.create({ name });
    res.status(201).json({ message: 'Category added successfully', name: newCategory.name });
  } catch (err) {
    console.error('Error adding category:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }

})





app.get('/', (req,res) => {
    res.send('Hello from Ginie Home')
})

app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
})
