'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UrlClick extends Model {
    static associate(models) {
      UrlClick.belongsTo(models.Url, {
        foreignKey: 'url_id',
        as: 'url'
      });
    }
  }
  UrlClick.init({
    url_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    clicked_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    referrer: {
      type: DataTypes.STRING(1024),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'UrlClick',
    tableName: 'url_clicks',
    timestamps: false
  });
  return UrlClick;
};
