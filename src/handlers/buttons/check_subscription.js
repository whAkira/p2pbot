const {main_keyboard} = require("../../keyboard");
const conf = require("../../constants/config");

module.exports = async (bot, options, user) => {
    try {
        const isChannel_1 = await bot.getChatMember(process.env.CHANNEL_ID1, user.id)
        const isChannel_2 = await bot.getChatMember(process.env.CHANNEL_ID2, user.id)

        if(isChannel_1.status === 'member' && isChannel_2.status === 'member') {
            const reply_markup =  JSON.stringify(main_keyboard)

            await bot.getMe().then( async (me) => {
                await bot.editMessageText(conf.greetings(me.username), {...options, reply_markup});
            })
        } else if (isChannel_1.status === 'left' || isChannel_2.status === 'left') {
            return
        }
    } catch (e) {
        console.log(e)
    }
}