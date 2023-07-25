const main_keyboard = {
    inline_keyboard: [
        [
            { text: 'Профиль', callback_data: 'profile_btn' }
        ],
        [
            { text: 'Добавить Актив', callback_data: 'add_asset' },
            { text: 'Добавить банк', callback_data: 'add_bank' },
        ],
        [
            { text: 'П2П Курсы', callback_data: 'p2p_btn' },
        ]
    ]
}

const back_btn = [{ text: 'Вернуться', callback_data: 'back'}]

const p2p_options_keyboard = {inline_keyboard: [
        [
            { text: 'Купить', callback_data: 'tradeType_BUY'},
            { text: 'Продать', callback_data: 'tradeType_SELL'},
        ],
        back_btn
    ]}

const next_prev_btn = [
    { text: "Дальше", callback_data: 'next'},
    { text: "Назад", callback_data: 'prev'},

]

module.exports = {
    main_keyboard,
    back_btn,
    p2p_options_keyboard,
    next_prev_btn
}