'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Solicitation = use('App/Models/Solicitation')
const Product = use('App/Models/Product')
/**
 * Resourceful controller for interacting with solicitations
 */
class SolicitationController {
  /**
   * Show a list of all solicitations.
   * GET solicitations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const sols = await Solicitation.query().with('user').with('product.user').fetch();
    return sols;
  }

  /**
   * Create/save a new solicitation.
   * POST solicitations
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth, response }) {
    const data  = request.only(['product_id']);
    const product     = await Product.findBy('id', data.product_id);
    const sol_product = await Solicitation.query().whereRaw(`product_id = '${data.product_id}' AND user_id = '${auth.user.id}'`).fetch();
    
    if (product == null) {
      return response.status(406).json({"message":"Product not found"});
    }else if (sol_product.rows.length > 0) {
      return response.status(406).json({"message":"This solicitation already exist"});      
    }else if(product.user_id == auth.user.id){
      return response.status(406).json({"message":"You cannot to solicit your own product"});      
    }else if (product.status != 1) {
      return response.status(406).json({"message":"This product cannot be solicited"});            
    }
    const sol = Solicitation.create({...data, user_id: auth.user.id});
    return sol;
  }

  /**
   * Display a single solicitation.
   * GET solicitations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const product_id  = params.product_id;
    const user_id     = params.user_id;
    if (user_id == undefined) {
      const sols = await Solicitation.query().where('product_id', '=', product_id).with('user').with('product.user').fetch();
      return sols;
    }else{
      const sol = await Solicitation.query().whereRaw(`product_id = '${product_id}' AND user_id = '${user_id}'`).with('user').with('product.user').fetch();
      return sol;
    }
  }


  /**
   * Update solicitation details.
   * PUT or PATCH solicitations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, auth, request, response }) {
    const {status} = request.all();
    //Recebe o id da solicitação para realizar a alteração
    const sol = await Solicitation.findBy('id', params.id);
    if (sol == null) {
      return response.status(406).json({"message":"Solicitation not found"})
    }
    //O usuário que estiver logado é que será o responsável por mudar o status
    let product = await Product.query().where('id', '=', sol.product_id).with('user').fetch();
        product = JSON.parse(JSON.stringify(product));
    
    if (product[0].user.id != auth.user.id) {
      return response.status(406).json({"message":"You aren't the owner of this product"});
    }
    if (status != 0 || status != 2) {
      
    }
    return product;
  }

  /**
   * Delete a solicitation with id.
   * DELETE solicitations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {

  }
}

module.exports = SolicitationController
