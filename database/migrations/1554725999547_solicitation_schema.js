'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SolicitationSchema extends Schema {
  up () {
    this.create('solicitations', (table) => {
      table.increments()

      table
          .integer('user_id', 11)
          .unsigned()
          .references('id')
          .inTable('users')
          .onUpdate('CASCADE')
          .onDelete('CASCADE')
      
      table
          .integer('product_id', 11)
          .unsigned()
          .references('id')
          .inTable('products')
          .onUpdate('CASCADE')
          .onDelete('CASCADE')
          
      table.integer('status', 11).notNullable().defaultTo(1)      
      table.timestamps()
    })
  }

  down () {
    this.drop('solicitations')
  }
}

module.exports = SolicitationSchema
