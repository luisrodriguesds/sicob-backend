'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SubcategorySchema extends Schema {
  up () {
    this.create('subcategories', (table) => {
      table.increments()
      table.string('name', 254).notNullable()
      table.string('thumb', 254)
      table.integer('category_id').unsigned().notNullable()
      table.foreign('category_id').references('categories.id').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.drop('subcategories')
  }
}

module.exports = SubcategorySchema
