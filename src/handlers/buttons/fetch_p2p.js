const models = require('../../db/models')
const $api = require('../../api/$api')
const {back_btn} = require("../../keyboard");
const config = require('../../constants/config')
const UserController = require('../../controllers/user_controller')
const FiatController = require('../../controllers/fiat_controller')

module.exports = async (bot, state, type, options) => {
    try {
        let resp = []
        let payTypesArr = []

        const fiatName = state[options.chat_id][state[options.chat_id].length - 1].replace('symbol_', '')
        const tradeType = type.replace('tradeType_', '')

        const userData = await UserController.getUserFiat((options.chat_id).toString())

        for ( const obj of userData) {
            const fiat = await models.Fiat.findOne(
                { where: { id: obj.dataValues.fiatId }}
            )

            if(fiat.dataValues.name === fiatName) {
                const bank = await FiatController.populate(fiat.id)
                payTypesArr.push(bank)
            }
        }

        for (const payType of payTypesArr) {
            const payload = {
                page: 1,
                rows: 20,
                publisherType: null,
                asset: 'USDT',
                tradeType,
                fiat: fiatName,
                payTypes: [payType.dataValues.name],
            }
            const res = await $api.fetchP2PData(config.uri.BINANCE, payload)

            const data = res.map(item => item.adv.price)
            resp.push([data, payType.dataValues.name])
        }

        const botResponse = resp.map(([values, name]) => {
            const fistVal = values[0];
            return `${name} ${fistVal}`;
        }).join(' | ');

        const reply_markup = JSON.stringify({ inline_keyboard: [back_btn] })

        await bot.editMessageText(botResponse, {...options, reply_markup})
    } catch (e) {
        console.log(e)
    }
}