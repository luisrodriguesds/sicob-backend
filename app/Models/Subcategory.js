'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Subcategory extends Model {
	category(){
		this.belongsTo('App/Models/Category')
	}
}

module.exports = Subcategory
