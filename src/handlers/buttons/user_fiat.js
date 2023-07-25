const { generateUserBasedKeyboard } = require('../../utils/keyboard')

module.exports = async (bot, options) => {
    try {
        const keyboard = {
            inline_keyboard: await generateUserBasedKeyboard(3, 'fiat', (options.chat_id).toString())
        }

        const reply_markup = JSON.stringify(keyboard)

        await bot.editMessageText(`Выберите валюту:`, {...options, reply_markup})
        return { state: 'fiat_p2p_' }
    } catch (e) {
        console.log(e)
    }
}