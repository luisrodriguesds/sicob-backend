'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Env = use('Env')

class Image extends Model {
  static get computed(){
    return ['url'];
  }

  getUrl({path}){
    return `${Env.get('HOST')}/api/images/${path}`
  }

  product(){
    return this.belongsTo('App/Models/Product');
  }
}

module.exports = Image
