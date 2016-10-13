'use strict';
module.exports = function(sequelize, DataTypes) {
  var Homeowners = sequelize.define('Homeowners', {
    ho_id: DataTypes.INT,
    ho_fn: DataTypes.STRING,
    ho_ln: DataTypes.STRING,
    address: DataTypes.STRING,
    phn_num: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Homeowners;
};