'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**O status pode ser 0(Recusado), 1(Em Análise), 2(aprovada) */

const Solicitation  = use('App/Models/Solicitation')
const Product       = use('App/Models/Product')
const User          = use('App/Models/User')
const Mail          = use('Mail');
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
  async index ({ request }) {
    const {page=1, perPage=10, status=undefined} = request.all();
    if (status !== undefined) {
      const sols = await Solicitation.query().where({status: status}).with('user').with('product.user').paginate(page, perPage);
      return sols;
    }
    else {
      const sols = await Solicitation.query().with('user').with('product.user').paginate(page, perPage);
      return sols;
    }
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
    const user  = await User.findBy('id', product.user_id);

    if (product == null) {
      return response.status(406).json({"message":"Product not found"});
    }else if (sol_product.rows.length > 0) {
      //Verifcar se o status da solicitacao é igual a 0. Se sim, só troca o status; se nao, a solicitação já existe
      if (sol_product.rows[0].status == 0) {
        await Solicitation.query().whereRaw(`product_id = '${data.product_id}' AND user_id = '${auth.user.id}'`).update({status: 1});
        await Product.query().where('id', '=', sol_product.rows[0].product_id).update({status: 2});        
        sol_product.rows[0].status = 1;

        

        await Mail.send('emails.newSolicitation', {user, product, auth}, (message) => {
          message
              .to(user.email)
              .from('<from-email>')
              .subject('SICOB - UFC | Nova solicitação')
          });

        return sol_product;
      }else{
        console.log(sol_product.rows[0].status)
        //O status pode ser 0(Recusada), 1(Em análise), 2(Aprovada)
        switch (sol_product.rows[0].status) {
          case 0:
            return response.status(406).json({"message":"This solicitation was refused"});
          case 1:
            return response.status(406).json({"message":"This solicitation already exist"});
          break;
          case 2:
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

    //Enviar email para o dono do produto

    await Mail.send('emails.newSolicitation', {user, product, auth}, (message) => {
      message
          .to(user.email)
          .from('<from-email>')
          .subject('SICOB - UFC | Nova solicitação')
      });
    
    //Mudar o status do produto
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
   * Retorna todas as solicitações (recebidas e feitas) de um determinado user
   */

  async historicAll({request, response, auth}){
    const {page = 1, perPage = 10} = request.get();
    
    if (auth.user == null) {
      return response.json({"message":"You must be authenticated"});
    } 

    const solicitation = await Solicitation.query()
    .select([
      'solicitations.*',
      'products.id AS product_id',
    ])
    .innerJoin('products', function () {
      this
      .on('solicitations.product_id', 'products.id')
    })
    .where('solicitations.user_id', auth.user.id)
    .orWhere('products.user_id', auth.user.id)
    .with('product')
    .with('user')
    .paginate(page, perPage)
    
    return solicitation
    
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
    const user_solicitation = await User.findBy('id', sol.user_id);
    
    if (productJSON[0].user.id != auth.user.id) {
      return response.status(406).json({"message":"You aren't the owner of this product"});
    }

    
    //>>>>>>>>>>>            O case 0 está sendo utilizado???? <<<<<<<<<<<<<<<


    switch (status) {
      case "0":
        //Solicitação recusada (Informar o motivo?)
        //Produto volta para status 1
        sol.status = status;
        await sol.save();
        await Product.query().where('id', '=', sol.product_id).update({status: 1});

        console.log(user_solicitation.email)

        await Mail.send('emails.refusedSolicitation', {user_solicitation, productJSON}, (message) => {
          message
              .to(user.email)
              .from('<from-email>')
              .subject('SICOB - UFC | Solicitação Recusada')
          });

        return sol;
      break;
      case "2":
        //Solicitacao atendida, status do produto muda para 3 (compartilhado)
        sol.status = status;
        await sol.save();
        await Product.query().where('id', '=', sol.product_id).update({status: 3});

        console.log(user_solicitation)

        await Mail.send('emails.acceptedSolicitation', {user_solicitation, productJSON}, (message) => {
          message
              .to(user_solicitation.email)
              .from('<from-email>')
              .subject('SICOB - UFC | Solicitação Atendida')
          });

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
    /**Usuario desistiu do produto ou O Dono do produto recusou a solicitação
     * nao excluir solicitacao, mudar seu status para 0,
     * caso solicite o mesmo produto, nao criar novamente, só mudar esse status
     * Status do produto volta para 1 (disponível) */
     
    const sol = await Solicitation.findBy('id', params.id);
    const product = await Product.query().where('id', '=', sol.product_id).with('user').fetch();
    const productJSON = JSON.parse(JSON.stringify(product));

    const user_solicitation = await User.findBy('id', sol.user_id);
    
    // console.log(auth.user.id, productJSON[0].user_id );
    if (sol == null) {
      return response.status(406).json({"message":"Solicitation not found"})
    }

    if (auth.user.id != sol.user_id && auth.user.id != productJSON[0].user_id) {
      return response.status(406).json({"message":"You aren't the owner of this solicitation"})
    }else{
      sol.status = 0;
      await sol.save();
      await Product.query().where('id', '=', sol.product_id).update({status: 1});

      console.log(user_solicitation.email)

      await Mail.send('emails.refusedSolicitation', {user_solicitation, productJSON}, (message) => {
          message
              .to(user_solicitation.email)
              .from('<from-email>')
              .subject('SICOB - UFC | Solicitação Recusada')
          })

      return true;
    }
  }
}

module.exports = SolicitationController
