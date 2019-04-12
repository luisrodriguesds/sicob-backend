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
      //Verifcar se status é o status do solicitacao é igual a 2, se for, só troca o status, se nao, a solicitação já existe
      if (sol_product.rows[0].status == 2 || sol_product.rows[0].status == 0) {
        await Solicitation.query().whereRaw(`product_id = '${data.product_id}' AND user_id = '${auth.user.id}'`).update({status: 1});
        await Product.query().where('id', '=', sol_product.rows[0].product_id).update({status: 2});        
        sol_product.rows[0].status = 1;
        return sol_product;
      }else{
        //O status pode ser 0(Recusado), 1(Já existe), 3(Aprovada)
        switch (sol_product.rows[0].status) {
          case 1:
            return response.status(406).json({"message":"This solicitation already exist"});
          break;
          case 3:
            return response.status(406).json({"message":"This solicitation already was approved"});
          break;
          default:
            return response.status(406).json({"message":"Invalid status"});            
          break;
        }
      }
    }else if(product.user_id == auth.user.id){
      return response.status(406).json({"message":"You cannot to solicit your own product"});      
    }else if (product.status != 1) {
      return response.status(406).json({"message":"This product cannot be solicited"});            
    }

    const sol = Solicitation.create({...data, user_id: auth.user.id});

    //Mudar status do produto e enviar email para o dono do produto
    // ..
    await Product.query().where('id', '=', data.product_id).update({status: 2});        
    
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
    const product = await Product.query().where('id', '=', sol.product_id).with('user').fetch();
    const productJSON = JSON.parse(JSON.stringify(product));
    
    if (productJSON[0].user.id != auth.user.id) {
      return response.status(406).json({"message":"You aren't the owner of this product"});
    }

    switch (status) {
      case "0":
        //Solicitação recusada (Informar o motivo?)
        //Produto volta para status 1
        sol.status = status;
        await sol.save();
        await Product.query().where('id', '=', sol.product_id).update({status: 1});
        return sol;
      break;
      case "3":
        //Solicitacao atendida, status do produto muda para 0
        sol.status = status;
        await sol.save();
        await Product.query().where('id', '=', sol.product_id).update({status: 0});
        return sol;
      break;
      default:
        return response.status(406).json({'message':'Invalid status'});
      break;
    }
  }

  /**
   * Delete a solicitation with id.
   * DELETE solicitations/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */

  async destroy ({ params, auth, request, response }) {
    //Usuario desistiu do produto, nao excluir solicitacao, mudar seu status para 2, caso solicite o mesmo produto, nao criar novamente, só mudar esse status
    //Status do produto volta para 1
    const sol = await Solicitation.findBy('id', params.id);
    if (sol == null) {
      return response.status(406).json({"message":"Solicitation not found"})
    }
    if (auth.user.id != sol.user_id) {
      return response.status(406).json({"message":"You aren't the owner of this solicitation"})
    }else{
      sol.status = 2;
      await sol.save();
      await Product.query().where('id', '=', sol.product_id).update({status: 1});
      return true;
    }
  }
}

module.exports = SolicitationController