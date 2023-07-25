const {main_keyboard} = require("../../keyboard");
const config = require('../../constants/config')
const keyboards = require("../../utils/keyboard");

module.exports = async (bot, userState, pageState, options, username) => {
    try {
        const chatId = options.chat_id

        if(userState[chatId] && userState[chatId].length > 1) {
            userState[chatId].pop()
            const prevState = userState[chatId][userState[chatId].length - 1]
            const page = userState[options.chat_id].length

            if(prevState === 'add_asset') {
                const keyboard = {
                    inline_keyboard: await keyboards.generateAssetsKeyboard(4, 20, page, 5)
                }

                const reply_markup = JSON.stringify(keyboard)

                await bot.editMessageText(`Chose`, {...options, reply_markup})
            } else if (prevState === 'fiat' ) {
                const keyboard = {
                    inline_keyboard: await keyboards.generateInlineKeyboard(3, 'fiat'),
                };
                const reply_markup = JSON.stringify(keyboard);

                await bot.editMessageText('Выберите валюту в которой хотите добавить институт', { ...options, reply_markup });
            } else if (prevState.startsWith('bank_')) {
                const fiat = prevState.replace('bank_', '')
                const keyboard = {
                    inline_keyboard: await keyboards.generateInlineKeyboard(3, 'bank', fiat),
                };
                const reply_markup = JSON.stringify(keyboard);

                await bot.editMessageText('Выберите валюту в которой хотите добавить институт', { ...options, reply_markup });
            } else if (prevState.startsWith('fiat_p2p_')) {
                const reply_markup = JSON.stringify(main_keyboard);
                await bot.editMessageText(config.msg1(username), {...options, reply_markup})
            }
        } else {
            const reply_markup = JSON.stringify(main_keyboard);
            await bot.editMessageText(config.greetings(username), {...options, reply_markup})
        }

    } catch (e) {
        console.log(e)
    }
}

