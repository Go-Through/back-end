module.exports = (sequelize, DataTypes) => {
  return sequelize.define('users', {
    nickname: {
      field: 'nickname',
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    memID: {
      field: 'mem_id',
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    memPW: {
      field: 'mem_pw',
      type: DataTypes.STRING,
      allowNull: true,
    },
    socialFlag: {
      field: 'social_flag',
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    socialID: {
      field: 'social_id',
      type: DataTypes.STRING,
      allowNull: true,
    },
    withID: {
      field: 'with_id',
      type: DataTypes.STRING,
      allowNull: true,
    },
    testIdx: {
      field: 'test_idx',
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    searchPlaces: {
      field: 'search_places',
      type: DataTypes.JSON,
      allowNull: true,
    },
    basketPlaces: {
      field: 'basket_places',
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'users',
  });
};
