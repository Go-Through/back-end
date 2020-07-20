module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tests', {
    testIdx: {
      field: 'test_idx',
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    likePlaces: {
      field: 'like_places',
      type: DataTypes.JSON,
      allowNull: true,
    },
    likeContents: {
      field: 'like_contents',
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'tests',
  });
};
