module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tourArea', {
    areaCode: {
      field: 'area_code',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    areaName: {
      field: 'area_name',
      type: DataTypes.STRING,
      allowNull: false,
    },
    sigunguCode: {
      field: 'sigungu_code',
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sigunguName: {
      field: 'sigungu_name',
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'tour_area',
  });
};
