'use strict';
const bcrypt = require('bcrypt-nodejs');
const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var contractors = sequelize.define('job_bids', {
    jobID: DataTypes.STRING,
    coID: DataTypes.STRING,
    estCost: DataTypes.INTEGER,
    estTime: DataTypes.INTEGER,
    startDays: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return job_bids;
};