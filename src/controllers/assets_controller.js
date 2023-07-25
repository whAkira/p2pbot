const models = require('../db/models')

module.exports = class AssetsController {

    static async findBySymbol(symbol) {
        try {
            return await models.Asset.findOne(
                { where: { name: symbol }}
            )
        } catch (e) {
            console.log(e)
        }
    }

    static async findById(id) {
        try {
            return await models.Asset.findOne(
                { where: { id }}
            )
        } catch (e) {
            console.log(e)
        }
    }

}