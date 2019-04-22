'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
const Env = use('Env')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }
  static get dates(){
    return super.dates.concat(['dob'])
  }

  static get hidden(){
    return ['password']
  }

  static get computed(){
    return ['url'];
  }

  getUrl({profile_photo}){
    return ((profile_photo == null) ? '' : `${Env.get('APP_URL')}/api/user/profilephoto/${profile_photo}`)
  }

  center(){
    return this.belongsTo('App/Models/Center', 'id_center');
  }

  product(){
    return this.hasMany('App/Models/Product')
  }

  
  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }
}

module.exports = User
