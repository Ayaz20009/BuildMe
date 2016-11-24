'use strict';
module.exports = function(sequelize, DataTypes) {
  var homeowner_jobs = sequelize.define('homeowner_jobs', {
    jobID: DataTypes.INTEGER,
    hoID: DataTypes.INTEGER,
    jobDesc: DataTypes.TEXT,
    address: DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return homeowner_jobs;
};