module.exports = (sequelize, DataTypes) => {
  return sequelize.define('places', {
    contentID: {
      field: 'content_id',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    placeCount: {
      field: 'place_count',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    placeHeart: {
      field: 'place_heart',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'places',
  });
};
