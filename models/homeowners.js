'use strict';
module.exports = function(sequelize, DataTypes) {
  var homeowners = sequelize.define('homeowners', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return homeowners;
};