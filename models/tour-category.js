module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tourCategory', {
    categoryCode: {
      field: 'category_code', // column 이름
      type: DataTypes.STRING, // 데이터 타입
      allowNull: false, // Null 허용
      primaryKey: true,
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
