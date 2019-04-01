'use strict'

const Center = use('App/Models/Center');


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with centers
 */
class CenterController {
  /**
   * Show a list of all Centers.
   * GET Centers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const centers = await Center.query().with('user').fetch();
    return centers;
  }

  /**
   * Create/save a new Center.
   * POST Centers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const data = request.only([
      'name', 'address', 'campus', 'city', 'website', 'initials'
    ]);
    const center = await Center.create(data);
    return center;
  }

  /**
   * Display a single Center.
   * GET Centers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const center = await Center.findBy('id', params.id);
    return center;
  }


  /**
   * Update Center details.
   * PUT or PATCH Centers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const center = await Center.findBy('id', params.id);
    if (center == null) {
      return response.send({"messager":"Row not found"})
    }

    const data = request.only([
      'name', 'address', 'campus', 'city', 'website', 'initials'
    ]);

    center.merge(data);
    await center.save();
    return center;
  }

  /**
   * Delete a Center with id.
   * DELETE Centers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const center = await Center.findBy('id', params.id);
    if (center == null) {
      return response.send({"messager":"Row not found"})
    }
    await center.delete();
    return null;
  }
}

module.exports = CenterController
