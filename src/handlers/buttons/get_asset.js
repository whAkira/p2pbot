const {generateAssetsKeyboard} = require('../../utils/keyboard')
const config = require('../../constants/config')

module.exports = async (bot, state, options) => {
    try {
        const page = state[options.chat_id].length
        const keyboard = {
            inline_keyboard: await generateAssetsKeyboard(4, 20, page, 5)
        }

        const reply_markup = JSON.stringify(keyboard)

        await bot.editMessageText(config.choice1, {...options, reply_markup})
        return { state: "add_asset"}
    } catch (e) {
        console.log(e)
    }
}