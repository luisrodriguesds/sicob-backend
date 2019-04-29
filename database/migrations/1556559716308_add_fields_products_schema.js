'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFieldsProductsSchema extends Schema {
  up () {
    this.table('products', (table) => {
      // alter table
      table.string('campus', 254)
      table.string('unity', 254)
      table.string('department', 254)

    })
  }

  down () {
    this.table('products', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddFieldsProductsSchema
