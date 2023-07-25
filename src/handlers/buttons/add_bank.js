const {generateInlineKeyboard} = require('../../utils/keyboard')
const config = require('../../constants/config')

module.exports = async (bot, data, options) => {
    try {
        const fiat = data.replace('fiat_', '')
        const keyboard = {
            inline_keyboard: await generateInlineKeyboard(3, 'bank', fiat)
        }
        const reply_markup = JSON.stringify(keyboard)
        await bot.editMessageText(config.choice3, { ...options, reply_markup });

        return {state: `bank_${fiat}`}
    } catch (e) {

    }
}