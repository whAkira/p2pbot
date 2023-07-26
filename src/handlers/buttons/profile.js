const {back_btn} = require("../../keyboard");
const UserController = require('../../controllers/user_controller')
const AssetController = require('../../controllers/assets_controller')
const {fetchCMCData} = require("../../api/$api");
const config = require('../../constants/config')

module.exports = async (bot, options, user) => {
    try {
        let assetArr = []
        let symbolArr = []

        const userAssets = await UserController.getUsersAssets((options.chat_id).toString())

        for(const obj of userAssets) {
            const assetData = await AssetController.findById(obj.dataValues.assetId)
            const amount = obj.dataValues.amount;
            assetArr.push({ ...assetData.dataValues, amount });
        }

        for (const obj of assetArr)
            symbolArr.push(
                {
                    symbol: obj.name,
                    id: obj.cmcId,
                    amount: obj.amount,

                }
            )

        let message = '';
        let totalHold = 0

        for (const item of symbolArr) {
            const res = await fetchCMCData(
                config.uri.COIN_MARKET_CAP,
                config.endpoints.quotes(item.symbol)
            );

            const assetData = res[item.symbol][0];
            if (assetData.id === item.id) {
                const priceUSD = assetData.quote.USD.price;
                const totalValue = priceUSD * item.amount;

                message += `${item.symbol} | Кол-во: ${item.amount} | Сумма: $${(totalValue).toFixed(2)}\n`;
                totalHold += totalValue
            } else {
                // Handle mismatched asset ids
                console.log(`Mismatched id for asset: ${item.symbol}`);
            }
        }

        message += `\n\n\*Общая сумма\* $${totalHold.toFixed(2)}`

        const reply_markup = JSON.stringify({ inline_keyboard: [back_btn] })

        await bot.editMessageText(config.profile(user, message), {...options, reply_markup})

        return { state: "profile" }
    } catch (e) {

    }
}

