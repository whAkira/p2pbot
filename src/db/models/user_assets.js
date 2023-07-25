const sequelize = require('../sequelize')
const { DataTypes } = require('sequelize')

const UserAssets = sequelize.define('user_assets', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})

module.exports = UserAssets