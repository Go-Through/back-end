module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tourContent', {
    contentCode: {
      field: 'content_code',
      type: DataTypes.INTEGER,
      allowNull: false,
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
