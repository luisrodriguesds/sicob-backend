'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RequestPassSchema extends Schema {
  up () {
    this.create('request_passes', (table) => {
      table.increments()
      table
          .integer('user_id', 11)
          .unsigned()
          .references('id')
          .inTable('users')
          .onUpdate('CASCADE')
          .onDelete('CASCADE')
      table.string('key', 256).notNullable()
      
      table.timestamps()
    })
  }

  down () {
    this.drop('request_passes')
  }
}

module.exports = RequestPassSchema
