require('dotenv').config()
const bot = require('./bot')

const InitDatabase = require('./db/index')
const UserController = require('./controllers/user_controller')

const buttons = require('./handlers/index')
const {main_keyboard, back_btn} = require("./keyboard");
const {storeBank} = require("./handlers");

const conf = require('./constants/config')

const start = async () => {

    await InitDatabase.connect()

    bot.setMyCommands([
        { command: 'start', description: 'Start command'}
    ])

    bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        const user = msg.from;
        await UserController.store(user)


        const isChannel_1 = await bot.getChatMember(process.env.CHANNEL_ID1, user.id)
        const isChannel_2 = await bot.getChatMember(process.env.CHANNEL_ID2, user.id)

        if(isChannel_1.status === 'member' && isChannel_2.status === 'member') {
            const options = {
                reply_markup: JSON.stringify(main_keyboard),
                parse_mode: 'Markdown',
            };

            await bot.getMe().then( async (me) => {
                await bot.sendMessage(chatId, conf.greetings(me.username), options);
            })
        } else if (isChannel_1.status === 'left' || isChannel_2.status === 'left') {
            const keyboard = {
                inline_keyboard: [
                    [{text: conf.subscribe1, url: 'https://t.me/kelpie_corp'}],
                    [{text: conf.subscribe2, url: 'https://t.me/kelpie_news'}],
                    [{text: conf.subscribed, callback_data: 'check_subscription'}]
                ]
            }

            const options = {
                reply_markup: JSON.stringify(keyboard),
                parse_mode: 'Markdown',
            }

            await bot.getMe().then( async (me) => {
                await bot.sendMessage(chatId, `Подпиитесь на каналы чтобы использовать бота`, options)
            })
        } else if (isChannel_1.status === 'creator' || isChannel_2.status === 'creator') {
            const options = {
                reply_markup: JSON.stringify(main_keyboard),
                parse_mode: 'Markdown',
            };

            await bot.getMe().then( async (me) => {
                await bot.sendMessage(chatId, conf.greetings(me.username), options);
            })
        }

    })

    const userState = {}
    const pageState = {}

    bot.on('message', async (msg) => {
        const text = await msg.text
        console.log(userState)

        try {
            if(userState[msg.chat.id].length === 2 && userState[msg.chat.id][1].startsWith('asset_')) {
                try {
                    const symbol = userState[msg.chat.id][1].replace('asset_', '')
                    let amount = parseInt(text)
                    if(Number.isSafeInteger(amount)) {
                        amount = Math.abs(amount);
                        console.log(amount)
                        await UserController.storeUsersAssets((msg.chat.id).toString(), symbol, amount)

                        const reply_markup = JSON.stringify({ inline_keyboard: [back_btn]})

                        await bot.sendMessage(msg.chat.id, `${symbol} сохранен в ваши активы`, { reply_markup })
                    } else if (!Number.isSafeInteger(amount)) {
                        const reply_markup = JSON.stringify({ inline_keyboard: [back_btn]})

                        await bot.sendMessage(msg.chat.id, `Введите актуальное количество ${symbol} которыми владеете`, { reply_markup })
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        } catch (e) {
            console.log(e)
        }
    })

    bot.on('callback_query', async (query) => {
        const { data, message: msg, from } = query

        const options = {
            chat_id: msg.chat.id,
            message_id: msg.message_id,
            parse_mode: 'Markdown',
        }

        const username = msg.from.username
        const user = from

        switch (data) {
            case 'profile_btn':
                try {
                    const { state: profile } = await buttons.profileBtn(bot, options, user.username)
                    userState[options.chat_id] = [profile]
                } catch (e) {
                    console.log(`Error`)
                }
                break;
            case 'add_asset':
                pageState[options.chat_id] = [1]
                const { state: add_asset } = await buttons.getAssetBtn(bot, pageState, options)
                userState[options.chat_id] = [add_asset]
                break;
            case data.startsWith("asset_") && data:
                await buttons.addAssetBtn(bot, data, userState, options)
                userState[options.chat_id].push(data)
                break;
            case 'add_bank':
                const { state: fiat} = await buttons.addFiatBtn(bot, options)
                userState[options.chat_id] = [fiat]
                break;
            case data.startsWith("fiat_") && data:
                const { state: bank_fiat } = await buttons.addBankBtn(bot, data, options)
                userState[options.chat_id].push(bank_fiat)
                break;
            case /^Wise|Sepa|SEPAinstant|SWIFT|Revolut|N26|BBVBank|Monzo|LloydsBank|Ziraat|BANK|Garanti|ISBANK|TinkoffNew|RaiffeisenBank|MTSBank|RosBankNew|Monobank|PrivatBank|ABank|PUMBBank|SenseSuperApp|RaiffeisenBank$/.test(data) && data:
                await storeBank(bot, userState, data, options)
                break;
            case 'p2p_btn':
                const { state: p2p_fiat } = await buttons.userFiatBtn(bot, options)
                userState[options.chat_id] = [p2p_fiat]
                break;
            case data.startsWith('symbol_') && data:
                const { state: fiat_p2p_symbol } = await buttons.tradeTypeBtn(bot, data, options)
                userState[options.chat_id].push(fiat_p2p_symbol)
                break;
            case data.startsWith('tradeType_') && data:
                await buttons.fetchP2PBtn(bot, userState, data, options)
                break;
            case 'next':
                try {
                    pageState[options.chat_id].push(pageState[options.chat_id].length + 1)
                    await buttons.getAssetBtn(bot, pageState, options)
                } catch (e) {
                    console.log(e)
                }
                break;
            case 'prev':
                pageState[options.chat_id].pop()
                await buttons.getAssetBtn(bot, pageState, options)
                break;
            case 'check_subscription':
                await buttons.checkSubscriptionBtn(bot, options, user)
                break;
            case 'back':
                await buttons.backBtn(bot, userState, pageState, options, username)
                break;
        }
    })

    console.log('Bot is ready and listening for commands.');
}

start()