'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class ManagerCustom {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, auth }, next) {
    // call next to advance the request
    if(auth.user.type == 'Gerente'){
      await next()
    }else{
      return response.send({"messeger":"You don't have a permission"});
    }
  }
}

module.exports = ManagerCustom
