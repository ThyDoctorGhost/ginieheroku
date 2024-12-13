// models/user.js
const DataTypes =  require('sequelize');
const bcrypt = require('bcrypt');

// Define the User model
module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensuring mobile number is unique
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Password hashing before saving the user
  User.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });

  return User;
};