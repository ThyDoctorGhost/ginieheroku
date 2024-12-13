// models/user.js
const DataTypes =  require('sequelize');

// Define the User model
module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  return Category;
};