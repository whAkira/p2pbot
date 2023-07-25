const Fiat = require('./models/fiat')
const User = require('./models/user')
const Bank = require('./models/bank')
const Asset = require('./models/assets')
const UserFiat = require('./models/user_fiat')
const UserAssets = require('./models/user_assets')


Bank.hasMany(Fiat)
Fiat.belongsTo(Bank)

User.belongsToMany(Asset, { through: UserAssets })
Asset.belongsToMany(User, { through: UserAssets })

User.belongsToMany(Fiat, { through: UserFiat })
Fiat.belongsToMany(User, { through: UserFiat })

module.exports = {
    Bank,
    User,
    Fiat,
    Asset,
    UserFiat,
    UserAssets
}