const sequelize = require('../sequelize')
const { DataTypes } = require('sequelize')

const Asset = sequelize.define('asset', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    cmcId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    }
})

module.exports = Asset