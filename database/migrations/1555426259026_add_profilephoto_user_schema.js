'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddProfilephotoUserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      // alter table
      table.string('profile_photo', 254)
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
    })
  }
}

module.exports = AddProfilephotoUserSchema
