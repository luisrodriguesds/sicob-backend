'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CenterSchema extends Schema {
  up () {
    this.create('centers', (table) => {
      table.increments()
      table.string('name', 246).notNullable();
      table.string('initials', 246).notNullable();
      table.string('address', 246).notNullable();
      table.string('campus', 246).notNullable();
      table.string('city', 246).notNullable();
      table.string('website', 246).notNullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('centers')
  }
}

module.exports = CenterSchema
