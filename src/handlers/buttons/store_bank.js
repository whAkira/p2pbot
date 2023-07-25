const UserController = require('../../controllers/user_controller')
const FiatController = require('../../controllers/fiat_controller')
const {back_btn} = require("../../keyboard");
const config = require('../../constants/config')

module.exports = async (bot, state, data, options) => {
    try {
        const fiatName = state[options.chat_id][state[options.chat_id].length - 1].replace('bank_', '')
        const fiatId = await FiatController.getFiatId(fiatName, data)

        const reply_markup = JSON.stringify({ inline_keyboard: [back_btn]})

        const isExist = await UserController.storeBank((options.chat_id).toString(), fiatId)

        if(isExist) {
            await bot.editMessageText(config.success1, {...options, reply_markup})
        }
        else {
            await bot.editMessageText(config.reject1, {...options, reply_markup})
        }
    } catch (e) {
        console.log(e)
    }
}