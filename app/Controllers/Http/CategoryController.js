'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Category = use('App/Models/Category')

/**
 * Resourceful controller for interacting with categories
 */
class CategoryController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const categories = await Category.query().with('subcategory').orderBy('name', 'asc').fetch();
    return categories;
  }

  /**
   * Create/save a new category.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const {name, thumb} = request.all();

    //if this name already exist
    const category = await Category.query().where('name', 'LIKE',name).fetch();
    if (category.rows.length !== 0) {
      return response.status(406).json({"messager":"This name already exist"});
    }  
    
    const data = await Category.create({name, thumb});
    return data;
    

  }

  /**
   * Display a single category.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params }) {
    const category = await Category.query().where('id', '=', params.id).with('subcategory').fetch()
    return category;
  }

  // Produrar por nome
  async search ({ params }) {
    const category = await Category.query().whereRaw(`name LIKE '%${params.name}%'`).fetch()
    return category;
  }
  

  /**
   * Update category details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const category = await Category.findBy('id', params.id)
    if (category == null) {
      return response.status(404).json()
    }
    const data = request.only(['name', 'thumb']);
    const check = await Category.query().where('name', 'LIKE', data.name).fetch();
    
    if (check.rows.length !== 0 && check.rows[0].name != category.name) {
      return response.status(406).json({"message":"This name already exist"})
    }
    category.merge(data);
    await category.save();
    return category;
  }

  /**
   * Delete a category with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    const category = await Category.findBy('id', params.id)
    if (category == null) {
      return response.status(404).json()
    }
    await category.delete()
    return response.status(200).json()
  }
}

module.exports = CategoryController
