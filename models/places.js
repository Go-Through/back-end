module.exports = (sequelize, DataTypes) => {
  return sequelize.define('places', {
    placeName: {
      field: 'place_name',
      type: DataTypes.STRING,
      allowNull: false,
    },
    placeCount: {
      field: 'place_count',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    contentID: {
      field: 'content_id',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'places',
  });
};
