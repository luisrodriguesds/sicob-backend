'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class OwnerOrManager {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, auth, params }, next) {
    // call next to advance the request
    if(auth.user.id == params.id || auth.user.type == 'Gerente'){
      await next()
    }else{
      return response.status(401).json();
    }
  }
}

module.exports = OwnerOrManager
