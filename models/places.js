module.exports = (sequelize, DataTypes) => {
  return sequelize.define('places', {
    contentID: {
      field: 'content_id',
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    contentTypeID: {
      field: 'content_type_id',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    placeCount: {
      field: 'place_count',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    placeHeart: {
      field: 'place_heart',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    placeTitle: {
      field: 'place_title',
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      field: 'address',
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      field: 'image',
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'places',
  });
};
