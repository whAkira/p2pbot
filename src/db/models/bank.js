const sequelize = require('../sequelize')
const { DataTypes } = require('sequelize')

const Bank = sequelize.define('bank', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
})

module.exports = Bank