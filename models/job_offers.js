'use strict';
const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var job_offers = sequelize.define('job_offers', {
    jobID: DataTypes.INTEGER,
    hoID: DataTypes.INTEGER,
    coID: DataTypes.INTEGER,
    bidID : DataTypes.INTEGER,
    estCost: DataTypes.INTEGER,
    finalCost: DataTypes.INTEGER,
    estDays: DataTypes.INTEGER,
    // estHours: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    comment : DataTypes.TEXT,
    accepted: DataTypes.BOOLEAN,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });


  return job_offers;
};
