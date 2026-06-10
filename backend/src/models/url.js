'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Url extends Model {
    static associate(models) {
      Url.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      Url.hasMany(models.UrlClick, {
        foreignKey: 'url_id',
        as: 'clicks'
      });
    }
  }
  Url.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    original_url: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    short_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    click_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'Url',
    tableName: 'urls',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });
  return Url;
};
