'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'teacher', 'student'),
        defaultValue: 'student'
      },
      otp: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      otpExpiresAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      resetToken: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      resetTokenExpiresAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      refresh_token: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.createTable('urls', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      original_url: {
        type: Sequelize.STRING(2048),
        allowNull: false
      },
      short_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      click_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    await queryInterface.addIndex('urls', ['short_code'], { unique: true, name: 'urls_short_code_unique' });
    await queryInterface.addIndex('urls', ['user_id'], { name: 'urls_user_id_index' });

    await queryInterface.createTable('url_clicks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'urls',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      clicked_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      referrer: {
        type: Sequelize.STRING(1024),
        allowNull: true
      }
    });

    await queryInterface.addIndex('url_clicks', ['url_id'], { name: 'url_clicks_url_id_index' });
    await queryInterface.addIndex('url_clicks', ['clicked_at'], { name: 'url_clicks_clicked_at_index' });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('url_clicks');
    await queryInterface.dropTable('urls');
    await queryInterface.dropTable('users');
  }
};
