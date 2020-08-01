module.exports = (sequelize, DataTypes) => {
  return sequelize.define('citys', {
    cityName: {
      field: 'city_name',
      type: DataTypes.STRING,
      allowNull: false,
    },
    cityCount: {
      field: 'city_count',
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    areaIndex: {
      field: 'area_index',
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'citys',
  });
};
