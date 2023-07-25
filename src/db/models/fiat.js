const sequelize = require('../sequelize')
const { DataTypes } = require('sequelize')

const Fiat = sequelize.define('fiat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Fiat