'use strict'

const Centro = use('App/Models/Centro');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with centros
 */
class CentroController {
  /**
   * Show a list of all centros.
   * GET centros
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const centros = await Centro.all();
    return centros;
  }

  /**
   * Create/save a new centro.
   * POST centros
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const data = request.only([
      'nome', 'endereco', 'campus', 'cidade', 'site'
    ]);
    const centro = await Centro.create(data);
    return centro;
  }

  /**
   * Display a single centro.
   * GET centros/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const centro = await Centro.findBy('id', params.id);
    return centro;
  }


  /**
   * Update centro details.
   * PUT or PATCH centros/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const centro = await Centro.findBy('id', params.id);
    if (centro == null) {
      return response.send({"messager":"Row not found"})
    }

    const data = request.only([
      'nome', 'endereco', 'campus', 'cidade', 'site'
    ]);

    centro.merge(data);
    await centro.save();
    return centro;
  }

  /**
   * Delete a centro with id.
   * DELETE centros/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const centro = await Centro.findBy('id', params.id);
    if (centro == null) {
      return response.send({"messager":"Row not found"})
    }
    await centro.delete();
    return null;
  }
}

module.exports = CentroController
