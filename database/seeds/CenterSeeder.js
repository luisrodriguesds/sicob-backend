'use strict'

/*
|--------------------------------------------------------------------------
| CenterSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database');

class CenterSeeder {
  async run () {
    const center = await Database.table('centers');
    console.log(center);
  }
}

module.exports = CenterSeeder
