const {generateInlineKeyboard} = require('../../utils/keyboard')
const config = require('../../constants/config')

module.exports = async (bot, options) => {
    try {
        const keyboard = {
            inline_keyboard: await generateInlineKeyboard(3, 'fiat')
        }

        const reply_markup =JSON.stringify(keyboard)

        await bot.editMessageText(config.choice2, { ...options, reply_markup });
        return { state: 'fiat' }
    } catch (e) {
        console.log(e)
    }
}