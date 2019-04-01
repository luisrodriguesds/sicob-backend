'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Center extends Model {
  user(){
    return this.hasMany('App/Models/User', 'id_center')
  }
}

module.exports = Center
