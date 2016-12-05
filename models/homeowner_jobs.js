'use strict';
module.exports = function(sequelize, DataTypes) {
  var homeowner_jobs = sequelize.define('homeowner_jobs', {
    hoID: DataTypes.INTEGER,
    jobDesc: DataTypes.TEXT,
    street: DataTypes.STRING,
    city:DataTypes.STRING,
    state:DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    numBids:DataTypes.INTEGER,
    bidID: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return homeowner_jobs;
};