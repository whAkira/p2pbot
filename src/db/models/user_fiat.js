const sequelize = require('../sequelize')
const { DataTypes } = require('sequelize')

const UserFiat = sequelize.define('user_fiat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

module.exports = UserFiat