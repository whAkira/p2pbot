const models = require('../db/models')
const keyboards = require('../keyboard')
const {back_btn} = require("../keyboard");
const FiatController = require('../controllers/fiat_controller')
const UserController = require('../controllers/user_controller')

const generateInlineKeyboard = async (_rows, _type, _fiat) => {
    try {
        let inline_keyboard = []
        let row = []
        let uniqueFiat = new Set()

        const data = await models.Fiat.findAll()
        for (const obj of data) {
            if(_type === 'bank') {
                if(_fiat === obj.dataValues.name) {
                    const bank = await FiatController.populate(obj.dataValues.id)
                    row.push({ text: bank.dataValues.name, callback_data: bank.dataValues.name})
                }

                if(row.length === _rows) {
                    inline_keyboard.push(row)
                    row = []
                }
            } else if (_type === 'fiat') {
                if(!uniqueFiat.has(obj.dataValues.name)) {
                    row.push({ text: obj.dataValues.name, callback_data: `fiat_${obj.dataValues.name}`})
                    uniqueFiat.add(obj.dataValues.name)
                }

                if(row.length === _rows) {
                    inline_keyboard.push(row)
                    row = []
                }
            }
        }

        if (row.length > 0) {
            inline_keyboard.push(row);
        }
        inline_keyboard.push(back_btn)

        return inline_keyboard
    } catch (e) {
        console.log(e)
    }
}

const generateUserBasedKeyboard = async (_rows, _type, _chatId) => {
    let inline_keyboard = []
    let row = []
    const uniqueFiat = new Set()

    const userData = await UserController.getUserFiat(_chatId)

    for (const obj of userData) {
        if(_type === 'fiat') {
            const fiatData = await FiatController.getFiatById(obj.dataValues.fiatId)

            if(!uniqueFiat.has(fiatData.dataValues.name)) {
                row.push({ text: fiatData.dataValues.name, callback_data: `symbol_${fiatData.dataValues.name}`})
                uniqueFiat.add(fiatData.dataValues.name)
            }

            if(row.length === _rows) {
                inline_keyboard.push(row)
                row = []
            }
        }
    }

    if (row.length > 0) {
        inline_keyboard.push(row);
    }
    inline_keyboard.push(back_btn)

    return inline_keyboard
}

const generateAssetsKeyboard = async (_rows, _size, state, pages) => {
    try {
        let inline_keyboard = []
        let row = []

        const offset = (state - 1) * _size

        const assetData = await models.Asset.findAll({ offset, limit: _size})
        const symbolArr = assetData.map((symbol) => symbol.dataValues.name)

        for (const symbol of symbolArr) {
            row.push({ text: symbol, callback_data: `asset_${symbol}`})

            if(row.length === _rows) {
                inline_keyboard.push(row)
                row = []
            }
        }

        if (row.length > 0) {
            inline_keyboard.push(row);
        }

        if(state <= 1) {
            inline_keyboard.push([{ text: "Дальше", callback_data: 'next' }])
        }
        else if (pages === state) {
            inline_keyboard.push([{ text: "Назад", callback_data: 'prev' }])
        } else {
            inline_keyboard.push([
                { text: "Назад", callback_data: 'prev' },
                { text: "Дальше", callback_data: 'next' }
            ])
        }

        inline_keyboard.push(keyboards.back_btn);

        return inline_keyboard
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    generateInlineKeyboard,
    generateUserBasedKeyboard,
    generateAssetsKeyboard
}