'use strict';
const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var homeowners = sequelize.define('homeowners', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    email: DataTypes.STRING,
    // password: DataTypes.STRING
    numCreated:DataTypes.INTEGER,
    numOffers:DataTypes.INTEGER,
    numStarted:DataTypes.INTEGER,
    numFinished:DataTypes.INTEGER,
    points:DataTypes.INTEGER,
    
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  homeowners.beforeCreate((homeowners) =>
    new sequelize.Promise((resolve) =>{
      bcrypt.hash(homeowners.password, null, null, (err, hashedPassword) => {
        resolve(hashedPassword);
      });
      }).then((hasedPw) => {
        homeowners.password = hasedPw;
      })
      );


  return homeowners;
};