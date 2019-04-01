'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model     = use('Model')
const Database  = use('Database')

class Product extends Model {

  static scopeNearBy(query, latitude, longitude, distance){
    const haversine = `(6371 * acos(cos(radians(${latitude}))
    * cos(radians(latitude))
    * cos(radians(longitude)
    - radians(${longitude}))
    + sin(radians(${latitude}))
    * sin(radians(latitude))))`;

    return query
    .select('*', Database.raw(`${haversine} as distance`))
    .whereRaw(`${haversine} < ${distance}`)
  }

  user(){
    return this.belongsTo('App/Models/User')
  }

  category(){
    return this.belongsTo('App/Models/Category')
  }

  subcategory(){
    return this.belongsTo('App/Models/Subcategory')
  }

  images(){
    return this.hasMany('App/Models/Image')
  }
  
}

module.exports = Product
