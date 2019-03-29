'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.string('name', 254).notNullable()
      table.text('description', 'mediumtext')
      table.string('num_patrimony', 254)
      table
          .integer('user_id', 11)
          .unsigned()
          .references('id')
          .inTable('users')
          .onUpdate('CASCADE')
          .onDelete('CASCADE')
      table
          .integer('category_id')
          .unsigned()
          .references('id')
          .inTable('categories')
          .onUpdate('CASCADE')
          .onDelete('CASCADE')
      table
          .integer('subcategory_id')
          .unsigned()
          .references('id')
          .inTable('subcategories')
          .onUpdate('CASCADE')
          .onDelete('CASCADE')
      table.string('address', 254)
      table.decimal('latitude', 9, 6).notNullable()
      table.decimal('longitude', 9, 6).notNullable()
      table.integer('status', 11).notNullable().defaultTo(1)
      table.timestamps()
    })
  }

  down () {
    this.drop('products')
  }
}

module.exports = ProductSchema
