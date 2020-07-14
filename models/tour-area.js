module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tourArea', {
    areaCode: {
      field: 'area_code', // column 이름
      type: DataTypes.INTEGER, // 데이터 타입
      allowNull: false, // Null 허용
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
