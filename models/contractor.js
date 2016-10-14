'use strict';
module.exports = function(sequelize, DataTypes) {
  var contractor = sequelize.define('contractor', {
    c_fn: DataTypes.STRING,
    c_ln: DataTypes.STRING,
    address: DataTypes.STRING,
    phn_num: DataTypes.INT,
    email: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return contractor;
};