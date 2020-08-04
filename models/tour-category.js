module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tourCategory', {
    categoryCode: {
      field: 'category_code',
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryName: {
      field: 'category_name',
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'tour_category',
  });
};
