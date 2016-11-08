'use strict';
module.exports = function(sequelize, DataTypes) {
  var contractors = sequelize.define('contractors', {
    name: DataTypes.STRING,
    companyName: DataTypes.STRING,
    phoneNumber: DataTypes.INTEGER,
    licenseNumber: DataTypes.INTEGER,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return contractors;
};