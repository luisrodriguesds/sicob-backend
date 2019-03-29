'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Category = use('App/Models/Category')
const Subcategory = use('App/Models/Subcategory')

/**
 * Resourceful controller for interacting with subcategories
 */
class SubcategoryController {
  /**
   * Show a list of all subcategories.
   * GET subcategories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({params}) {
    const cat_id = params.id;
    const subs = await Subcategory.query().where('category_id', '=', cat_id).orderBy('name', 'asc').fetch();
    //add cat
    if (subs.rows.length !== 0) {
      const cat = await Category.findBy('id', params.id);
      for (let i = 0; i < subs.rows.length; i++) {
        subs.rows[i].category = cat;
      }

    }
    return subs;
  }

  /**
   * Create/save a new subcategory.
   * POST subcategories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const data = request.only(['name', 'thumb', 'category_id']);
    
    //if exist
    const cat = await Category.findBy('id', data.category_id);
    if (cat.length == 0) {
      return response.status(406).json({"message":"Category not found"})
    }

    //if this name already exist
    const sub = await Subcategory.query().where('name', 'LIKE', data.name).fetch();
    if (sub.rows.length !== 0) {
      return response.status(406).json({"message":"This name already exist"});
    }

    const subcategory = await Subcategory.create(data);
    return subcategory;
  }

  /**
   * Display a single subcategory.
   * GET subcategories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const sub = await Subcategory.query().where('id', '=', params.id).orderBy('name', 'asc').fetch()
    //add cat
    if (sub.rows.length != 0) {
      const cat = await Category.findBy('id', sub.rows[0].category_id);
      sub.rows[0].category = cat;
    }
    return sub
  }

  async search ({ params, request, response, view }) {
    const sub = await Subcategory.query().whereRaw(`name LIKE '%${params.name}%' AND category_id = ${params.category_id}`).orderBy('name', 'asc').fetch()
    //add cat
    if (sub.rows.length !== 0) {
      const cat = await Category.findBy('id', params.category_id);
      for (let i = 0; i < sub.rows.length; i++) {
        sub.rows[i].category = cat;
      }

    }
    return sub
  }
  

  /**
   * Update subcategory details.
   * PUT or PATCH subcategories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const data = request.only(['name', 'thumb', 'category_id'])
    
    //if subcaterogy
    const sub = await Subcategory.findBy('id', params.id)
    if (sub.length == 0) {
      return response.status(406).json({"message":"Row not found"})
    }

    //if category exist
    const cat = await Category.findBy('id', data.category_id);
    if (cat.length == 0) {
      return response.status(406).json({"message":"Category not found"})
    }

    //if this name already exist
    const subName = await Subcategory.query().whereRaw(`name LIKE '${data.name}' AND category_id = '${data.category_id}'`).fetch();
    if (subName.rows.length !== 0 && params.id != subName.rows[0].id) {
      return response.status(406).json({"message":"This name already exist"});
    }
    sub.merge(data);
    await sub.save();
    return sub;
  }

  /**
   * Delete a subcategory with id.
   * DELETE subcategories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
     const sub = await Subcategory.findBy('id', params.id);
     if (sub.length == 0) {
       return response.status(406).json({"message":"Row not found"})
     }
     sub.delete();
     return response.status(200).json();
  }
}

module.exports = SubcategoryController
