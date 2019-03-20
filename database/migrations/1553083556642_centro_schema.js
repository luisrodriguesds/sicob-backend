'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CentroSchema extends Schema {
  up () {
    this.create('centros', (table) => {
      table.increments()
      table.string('nome', 246).notNullable();
      table.string('endereco', 246).notNullable();
      table.string('campus', 246).notNullable();
      table.string('cidade', 246).notNullable();
      table.string('site', 246).notNullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('centros')
  }
}

module.exports = CentroSchema
