'use strict';
module.exports = function(sequelize, DataTypes) {
  var homeowner_jobs = sequelize.define('homeowner_jobs', {
    hoID: DataTypes.INTEGER,
    jobDesc: DataTypes.TEXT,
    street: DataTypes.STRING,
    city:DataTypes.STRING,
    state:DataTypes.STRING,
    zipcode: DataTypes.INTEGER,
    numBids:DataTypes.INTEGER,
    bidID: DataTypes.INTEGER,
    // byDate: DataTypes.DATE,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return homeowner_jobs;
};