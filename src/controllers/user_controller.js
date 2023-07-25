const models = require('../db/models')
const AssetsController = require('./assets_controller')

module.exports = class UserController {

    /**
     *
     * @param data
     * @returns {Promise<*|Model<any, TModelAttributes>>}
     */
    static async store({...data}) {
        try {
             const candidate = await models.User.findOne(
                 { where: { tgId: (data.id).toString() }}
             )

            if(candidate)
                return await models.User.update(
                    { username: data.username },
                    { where: { tgId: (data.id).toString() }}
                )

            return await models.User.create(
                {
                    tgId: (data.id).toString(),
                    username: data.username
                }
            )
        } catch (e) {
            console.log(e)
        }
    }

    static async storeUsersAssets(tgId, symbol, amount) {
        try {
            const asset = await AssetsController.findBySymbol(symbol)
            const user = await models.User.findOne(
                { where: {tgId} }
            )

            const isExist = await models.UserAssets.findOne(
                { where: {
                    userId: user.dataValues.id,
                    assetId: asset.dataValues.id
                }}
            )

            if(!isExist) {
                await models.UserAssets.create(
                    {
                        userId: user.dataValues.id,
                        assetId: asset.dataValues.id,
                        amount
                    }
                )
            }
        } catch (e) {
            console.log(e)
        }
    }

    static async storeBank(tgId, bankId) {
        try {
            const user = await models.User.findOne(
                { where: { tgId }}
            )

            if(!user)
                return

            const validate = await models.UserFiat.findOne({ where: { userId: user.id, fiatId: bankId }})

            if(!validate) {
                return await models.UserFiat.create({ userId: user.id, fiatId: bankId })
            }

            return null
        } catch (e) {
            console.log(e)
        }
    }

    static async getUsersAssets(tgId) {
        try {
            const user = await models.User.findOne(
                { where: { tgId }}
            )

            const userAssets = await models.UserAssets.findAll(
                { where: { userId: user.dataValues.id }}
            )

            if(!userAssets)
                return

            return userAssets
        } catch (e) {
            console.log()
        }
    }

    static async getUserFiat(tgId) {
        try {
            const user = await models.User.findOne(
                { where: { tgId }}
            )

            if(!user)
                return

            return await models.UserFiat.findAll(
                { where: { userId: user.id }}
            )
        } catch (e) {
            console.log(e)
        }
    }
}