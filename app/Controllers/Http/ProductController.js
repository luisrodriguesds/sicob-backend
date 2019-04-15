'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Product = use('App/Models/Product')
const Category = use('App/Models/Category')
const Subcategory = use('App/Models/Subcategory')

/**
 * Resourceful controller for interacting with products
 */
class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  //Rota para exibir produtos na página inicial
  async index ({ request, params, auth }) {
    const {latitude, longitude} = request.all();
    const page    = (params.page != undefined) ? params.page : 1
    const perPage = (params.perPage != undefined) ? params.perPage : 10
    //if the user's location is 
    if (latitude != undefined || longitude != undefined) {
      const products = await Product
                                  .query()
                                  .where('status', '=', '1')
                                  .with('images')
                                  .with('category')
                                  .with('subcategory')
                                  .with('user.center')
                                  .orderBy('created_at', 'desc')
                                  .nearBy(latitude, longitude, 1)
                                  .paginate(page, perPage)
      return products;
    }else{
      const products = await Product
                                  .query()
                                  .where('status', '=', '1')
                                  .with('images')
                                  .with('category')
                                  .with('subcategory')
                                  .with('user.center')
                                  .orderBy('created_at', 'desc')
                                  .paginate(page, perPage)
                                  
                                
      return products;
    }
  
  }
  //Rota para diversos filtros
  async filter(request, response){

  }
  /**
   * Create/save a new product.
   * POST products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth, response }) {
    const data = request.only(['name', 'description', 'num_patrimony', 'category_id', 'subcategory_id', 'address', 'latitude', 'longitude']);
    //Exibiir seus próprios produtos 
    //if exist category
    const cat = await Category.findBy('id', data.category_id)
    if (cat == null) {
      return response.status(406).json({"message":"Category not found"})
    }

    //if exist subcat
    const sub = await Subcategory.findBy('id', data.subcategory_id)
    if (sub == null) {
      return response.status(406).json({"message":"Subcategory not found"})
    }
    
    //if sub belongs to cat
    if (cat.id != sub.category_id) {
      return response.status(406).json({"message":"Subcategory don't belongs to this category"})      
    }

    const product = await Product.create({...data, user_id: auth.user.id})

    return product;
  }

  /**
   * Display a single product.
   * GET products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  //Rota para exibir a página unica do produto
  async show ({ params, auth, request, response, view }) {
    //Exibir se status = 1, se nao verificar se é dono do produto ou se é solicitadando do produto
    const product = await Product.findBy('id', params.id);
    try {
      await auth.check();
    } catch (error) {
      
    }
    if (product == null) {
      //Se o produto nao for encontrado
      return response.json();
    }else if (product.status == 1) {
      //Se o status = 1, pode exibir o produto
      await product.load('user.center')
      await product.load('images')
      await product.load('category')
      await product.load('subcategory')
      return product
    }else if(auth.user == null){
      //Caso o status != 1, pedir autenticacao
      return response.json()
    }else if (product.user_id == auth.user.id) {
      //Caso auth seja dono do produto, pode exibir independente do status
      await product.load('user.center')
      await product.load('images')
      await product.load('category')
      await product.load('subcategory')
      await product.load('solicitation')
      return product
    }else{
      //Caso nao seja dono do produto, mas seja o solicitadando, pode exibir o produto independente do status
      await product.load('solicitation')
      const jsonProd = JSON.parse(JSON.stringify(product))
      if (product.solicitation != null && jsonProd.solicitation[0].user_id == auth.user.id) {
        await product.load('user.center')
        await product.load('images')
        await product.load('category')
        await product.load('subcategory')
        return product
      }else{
        return response.json();
      }
    }
  }
  //Rota para exibir todos os produtos já solicitados
  async showSolicitation(auth){

  }

  //Rota para exibir produtos já cadastrados
  async showHistory(auth){

  }
  /**
   * Update product details.
   * PUT or PATCH products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, auth, request, response }) {
    const data = request.only(['name', 'description', 'num_patrimony', 'category_id', 'subcategory_id', 'address', 'latitude', 'longitude']);
    
    //if exist the product
    const product = await Product.findBy('id', params.id)
    if (product == null) {
      return response.status(406).json({"message":"Product not found"})
    }

    //if producut belongs to owner or if the user is manager
    if (auth.user.id == product.user_id || auth.user.type == 'Gerente') {

        //if exist category
        const cat = await Category.findBy('id', data.category_id)
        if (cat == null) {
          return response.status(406).json({"message":"Category not found"})
        }

        //if exist subcat
        const sub = await Subcategory.findBy('id', data.subcategory_id)
        if (sub == null) {
          return response.status(406).json({"message":"Subcategory not found"})
        }

        //if sub belongs to cat
        if (cat.id != sub.category_id) {
          return response.status(406).json({"message":"Subcategory don't belongs to this category"})      
        }
        product.merge(data)
        product.save();
        return product;

    }else{
      return response.status(406).json({"message":"You don't have permission"})
    }

  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, auth, response }) {
    
    //if exist the product
    const product = await Product.findBy('id', params.id)
    if (product == null) {
      return response.status(406).json({"message":"Product not found"})
    }

    //if producut belongs to owner or if the user is manager
    if (auth.user.id == product.user_id || auth.user.type == 'Gerente') {
      await product.delete();
      return response.status(200).json();
    }else{
      return response.status(406).json({"message":"You don't have permission"})
    }
  }
}

module.exports = ProductController
