module.exports = {
    endpoints: {
        latest: 'v1/cryptocurrency/listings/latest',
        quotes: (symbol) => `v2/cryptocurrency/quotes/latest?symbol=${symbol}`
    },
    uri: {
        BINANCE: "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
        COIN_MARKET_CAP: `https://pro-api.coinmarketcap.com/`
    },

    greetings: (botName) => `\*Главная\*
    
Меня зовут ${botName}, я твой карманный помощник,
созданый для быстрого и удобного отслеживания
цен на свои активы, а так же взаимодействия с binance P2P

\*Я умею!\*
- Сохранять твои крипто активы и отображать полную цену по текущему курсу
- Отображать информацию по P2P заявкам, по выбраным валютам и банкам

\*Обратная связь\*
Если у вас есть предложения по доработке бота или вы обнаружили баг
вы можете связаться через телеграм: @KelpieSupport`,
    profile: (username, msg) => `\*Привет ${username}\* \n\nОбщые цены твоих активов \n\n${msg}`,
    msg1: (botName) => `Привет я @${botName}, выбери действие`,
    choice1: 'Выберите криптовалюту: ',
    choice2: 'Выберите валюту в которой хотите добавить банк: ',
    choice3: 'Выберите банк: ',
    success1: 'Банк успешно добавлен',
    success2: '',
    reject1: 'Вы уже добавили банк',

    subscribed: 'Я подписался'
}