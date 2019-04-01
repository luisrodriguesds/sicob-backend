'use strict'
const Product = use('App/Models/Product')
const Image   = use('App/Models/Image')
const Helpers = use('Helpers')
const Drive   = use('Drive');

class ImageController {
  
  async store({request, response, params}){
    const product = await Product.findBy('id', params.id);
    if (product == null) {
      return response.status(406).json({"message":"Product not found"})
    }
    //get images to the body request
    const images = request.file('image', {types:['image'], size:'2mb'})

    await images.moveAll(Helpers.tmpPath('uploads'), file => ({
      name: `${Date.now()}-${file.clientName}`
    }))

    if (!images.movedAll()) {
      return images.erros()
    }

    await Promise.all(
      images.movedList().map(images => product.images().create({path: images.fileName}))
    )
    return images;
  }


  async show({request, response, params}){
    return response.download(Helpers.tmpPath(`uploads/${params.path}`))
  }

  async destroy ({ params, auth, request, response }) {
    const image = await Image.query().whereRaw(`id = '${params.id}'`).with('product').fetch();
    if (image.rows.length == 0) {
      response.status(406).json({"message":"Image not found"})
    }
    
    //check if the image belongs to the product and this product belongs to the user
    const imageJSON = image.toJSON()
    if (auth.user.id == imageJSON[0].product.user_id || auth.type == 'Gerente') {
      //delete file
      await Drive.delete(Helpers.tmpPath(`uploads/${imageJSON[0].path}`))

      //delete row
      const imageSelect = await Image.findBy('id', params.id)
      await imageSelect.delete()

      return response.status(200).json()
    }else{
      return response.status(406).json({"message":"You don't have permission"})
    }
    
  }
}

module.exports = ImageController
