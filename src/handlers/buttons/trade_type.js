const {p2p_options_keyboard} = require("../../keyboard");

module.exports = async (bot, data, options) => {
    try {
        const reply_markup = JSON.stringify(p2p_options_keyboard)

        await bot.editMessageText(`Выберите опцию:`, {...options, reply_markup})
        return { state: data }
    } catch (e) {
        console.log(e)
    }
}