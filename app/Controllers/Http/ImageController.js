'use strict'
const Product = use('App/Models/Product')
const Image   = use('App/Models/Image')
const Helpers = use('Helpers')

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
    console.log(images)
    return images;
  }


  async show({request, response, params}){
    return response.download(Helpers.tmpPath(`uploads/${params.path}`))
  }

}

module.exports = ImageController
