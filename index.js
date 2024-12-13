const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('./user_model'); // Path to your user model
const CatModel = require('./category_model');



const app = express();
const port = process.env.PORT || 5050;



app.use(cors());
app.use(bodyParser.json());

const sequelize = new Sequelize('giniebase', 'u432853459_hassaanzafar00', 'Alpharoot@4278', {
    host: 'springgreen-meerkat-698997.hostingersite.com',
    dialect: 'mysql' // Change to 'postgres' if using PostgreSQL
});

sequelize.sync()
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error(err)
);

const User = UserModel(sequelize);  // Pass the sequelize instance to the model
const Category = CatModel(sequelize);

// For registering categories // Delete after adding all categories
app.post('/addcat', async (req, res) => {
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

// User Registration Route
app.post('/register', async (req, res) => {
    const { name, mobile_number, password } = req.body;
  
    if (!name || !mobile_number || !password) {
      return res.status(400).json({ message: 'Please provide all required fields: name, mobile_number, password.' });
    }
  
    try {
      // Check if mobile number is already taken
      const existingUser = await User.findOne({ where: { mobile_number } });
      if (existingUser) {
        return res.status(400).json({ message: 'Mobile number already registered' });
      }
  
      // Create a new user
      const newUser = await User.create({ name, mobile_number, password });
      res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
    } catch (err) {
      console.error('Error registering user:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // New Route to Get All Users
app.get('/users', async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await User.findAll();
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Send the list of users as response
    res.status(200).json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




app.get('/', (req,res) => {
    res.send('Hello from Ginie Home')
})

app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
})