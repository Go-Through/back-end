module.exports = (sequelize, DataTypes) => {
  return sequelize.define('users', {
    nickname: {
      field: 'nickname',
      type: DataTypes.STRING,
      allowNull: true,
    },
    memID: {
      field: 'mem_id',
      type: DataTypes.STRING,
      allowNull: false,
    },
    socialType: {
      field: 'social_type',
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      field: 'email',
      type: DataTypes.STRING,
      allowNull: true,
    },
    memPW: {
      field: 'mem_pw',
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      field: 'image',
      type: DataTypes.STRING,
      allowNull: true,
    },
    withID: {
      field: 'with_id',
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    withEvent: {
      field: 'with_event',
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
