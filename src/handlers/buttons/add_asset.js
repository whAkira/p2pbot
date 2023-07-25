const models = require('../../db/models')
const {back_btn} = require("../../keyboard");

module.exports = async (bot, data, state, options) => {
    try {
        const symbol = data.replace('asset_', '')

        const asset = await models.Asset.findOne(
            { where: {name: symbol} }
        )

        const user = await models.User.findOne(
            { where: { tgId: (options.chat_id).toString() }}
        )

        const isExist = await models.UserAssets.findOne(
            { where: { userId: user.dataValues.id, assetId: asset.dataValues.id }}
        )

        if(!isExist) {
            await bot.sendMessage(options.chat_id, `Введите количество ${symbol}, которые у вас есть`)
            return { state: `add_asset_amount`}
        }
        else {
            await models.UserAssets.destroy(
                { where: { id: isExist.id }}
            )
            await bot.sendMessage(options.chat_id, `Введите новое количество ${symbol}, которые у вас есть`)
            return { state: `add_asset_amount`}
        }



    } catch (e) {
        console.log(e)
    }
}

