'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
 
       return [
     queryInterface.addColumn('homeowners',
        "numCreated",
        {
          type: Sequelize.INTEGER,
          defaultValue:0
        }
      ),
     
      queryInterface.addColumn('homeowners',
        "numOffers",
        {
          type: Sequelize.INTEGER,
          defaultValue:0
        }
      ),

      queryInterface.addColumn('homeowners',
        "numStarted",
        {
          type: Sequelize.INTEGER,
          defaultValue:0
        }
      ),

       queryInterface.addColumn('homeowners',
        "numFinished",
        {
          type: Sequelize.INTEGER,
          defaultValue:0

        }
      ),
       queryInterface.addColumn('homeowners',

        "points",
        {
          type: Sequelize.INTEGER,
          defaultValue:0
        }
      ),

      ];

  },

  down: function (queryInterface, Sequelize) {
 
        return [
      queryInterface.removeColumn('homeowners', 'numCreated'),
      queryInterface.removeColumn('homeowners', 'numOffers'),
      queryInterface.removeColumn('homeowners', 'numStarted'),
      queryInterface.removeColumn('homeowners', 'numFinished'),
      queryInterface.removeColumn('homeowners', 'points'),


    ];
  }
};
