'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
     
       return [
     queryInterface.addColumn('contractors',
        "numBids",
        {
          type: Sequelize.INTEGER,
          defaultValue:0
        }
      ),
     
      queryInterface.addColumn('contractors',
        "numDeclined",
        {
          type: Sequelize.INTEGER,
          defaultValue:0
        }
      ),

      queryInterface.addColumn('contractors',
        "numStarted",
        {
          type: Sequelize.INTEGER,
           defaultValue:0
        }
      ),

       queryInterface.addColumn('contractors',
        "numFinished",
        {
          type: Sequelize.INTEGER,
           defaultValue:0
        }
      ),

        queryInterface.addColumn('contractors',
        "numPoints",
        {
          type: Sequelize.INTEGER,
           defaultValue:0
        }
      ),

      ];
  },

  down: function (queryInterface, Sequelize) {
     
        return [
      queryInterface.removeColumn('contractors', 'numBids'),
      queryInterface.removeColumn('contractors', 'numDeclined'),
      queryInterface.removeColumn('contractors', 'numStarted'),
      queryInterface.removeColumn('contractors', 'numFinished'),
      queryInterface.removeColumn('contractors', 'points'),

    ];
  }
};
