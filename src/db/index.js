const sequelize = require('./sequelize')
const models = require('./models')
const binance = require('../constants/binance')
const config = require('../constants/config')
const $api = require('../api/$api')

module.exports = class InitDatabase {
    static async connect() {
        await sequelize.authenticate()
        await sequelize.sync()

        await this.storeBinanceData()
        await this.storeAssetData()
    }

    static async storeBinanceData() {
        try {
            for (const obj of binance) {
                for (const payType of obj.payTypes) {
                    const [bank] = await models.Bank.findOrCreate(
                        {where: { name: payType} }
                    )

                    const isExistFiat = await models.Fiat.findOne(
                        { where: { name: obj.fiat, bankId: bank.id }}
                    )

                    if (!isExistFiat)
                        await models.Fiat.create({ name: obj.fiat, bankId: bank.id })
                }
            }
        } catch (e) {
            console.error('Error storing data', e);
        }
    }


    static async storeAssetData() {
        try {
            const data = await $api.fetchCMCData(
                config.uri.COIN_MARKET_CAP,
                config.endpoints.latest
            )

            for (const obj of data) {
                const isExistAsset = await models.Asset.findOne(
                    { where: {
                        name: obj.symbol
                    }}
                )

                if(!isExistAsset)
                    await models.Asset.create({
                        name: obj.symbol,
                        cmcId: obj.id
                    })
            }
        } catch (e) {
            console.log(e)
        }
    }
}