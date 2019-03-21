'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddRelationshipCenterUserSchema extends Schema {
  up () {
    this.alter('users', (table) => {
      // alter table
      table
        .integer('id_center', 11)
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('centers')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
  }

  down () {
    this.alter('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddRelationshipCenterUserSchema
