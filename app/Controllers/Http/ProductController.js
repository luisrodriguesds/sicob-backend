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
  async index ({ request, params }) {
    const {latitude, longitude} = request.all();
    const page    = (params.page != undefined) ? params.page : 1
    const perPage = (params.perPage != undefined) ? params.perPage : 10
    
    //if the user's location is 
    if (latitude != undefined || longitude != undefined) {
      const products = await Product
                                  .query()
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
                                  .with('images')
                                  .with('category')
                                  .with('subcategory')
                                  .with('user.center')
                                  .orderBy('created_at', 'desc')
                                  .paginate(page, perPage)
                                  
                                
      return products;
    }
  
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
  async show ({ params, request, response, view }) {
    const product = await Product.findBy('id', params.id);
    await product.load('user.center')
    await product.load('images')
    await product.load('category')
    await product.load('subcategory')
    return product
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
