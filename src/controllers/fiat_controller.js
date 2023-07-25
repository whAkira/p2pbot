const models = require('../db/models')

module.exports = class FiatController {

    static async populate(fiatId) {
        try {
            const fiat = await models.Fiat.findOne({ where: {id: fiatId}})
            return await models.Bank.findOne({ where: {id: fiat.bankId}})
        } catch (e) {
            console.log(e)
        }
    }

    static async getFiatId(fiatName, bankName) {
        try {
            const bank = await models.Bank.findOne(
                { where: { name: bankName }}
            )
            const fiat = await models.Fiat.findOne(
                { where: { name: fiatName, bankId: bank.id}}
            )
            return fiat.dataValues.id
        } catch (e) {

        }
    }

    static async getFiatById(fiatId) {
        try {
            return await models.Fiat.findOne(
                { where: {id: fiatId}}
            )
        } catch (e) {

        }
    }
}