'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImageSchema extends Schema {
  up () {
    this.create('images', (table) => {
      table.increments()
      table
          .integer('product_id')
          .unsigned()
          .references('id')
          .inTable('products')
          .onUpdate('CASCADE')
          .onDelete('CASCADE')
      table.string('path', 256).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('images')
  }
}

module.exports = ImageSchema
