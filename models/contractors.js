'use strict';
const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var contractors = sequelize.define('contractors', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
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

  contractors.beforeCreate((contractors) =>
    new sequelize.Promise((resolve) =>{
      bcrypt.hash(contractors.password, null, null, (err, hashedPassword) => {
        resolve(hashedPassword);
      });
      }).then((hasedPw) => {
        contractors.password = hasedPw;
      })
      );



  return contractors;
};
