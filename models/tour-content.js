module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tourContent', {
    contentCode: {
      field: 'content_code', // column 이름
      type: DataTypes.INTEGER, // 데이터 타입
      allowNull: false, // Null 허용
    },
    contentName: {
      field: 'content_name',
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'tour_content',
  });
};
