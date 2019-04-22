'use strict'

const User = use('App/Models/User');
const Centro = use('App/Models/Center');
const Helpers = use('Helpers')
const Drive   = use('Drive');

class UserController {
    
    async index(){
        const users = await User.query().with('center').fetch();
        
        return users.toJSON();
    }

    async create({request, response}){
        const data = request.only(['username', 'name', 'address', 'id_center', 'website', 'type', 'email', 'password'])
        
        //Verificar se o centro existe
        //Verificar se o centro passado existe
        const centro = await Centro.findBy('id', data.id_center);
        if(centro == null){
            return response.send({"messager":"Couldn't found the centro"});
        }
        //Check if there are centros
        const user = await User.create(data);

        return user;
    }

    async profilephoto({request, params, response, auth}){
        //Check user_id
        const user_id = await User.findBy('id', params.id);
        if (user_id == null) {
            return response.status(406).json({"message":"User not found"})
        }
        const image = request.file('image', {type:['image'], size:'2mb'});
        const newName = `${Date.now()}${user_id.id}.${image.extname}`;        
        
        await image.move(Helpers.tmpPath('profiles'), {
            name: newName
        });

        if (!image.move()) {
            return images.erro();
        }

        await User.query().where({id:params.id}).update({profile_photo: newName})

        return image;
    }

    async showProfilephoto({params, response}){
        return response.download(Helpers.tmpPath(`profiles/${params.path}`))
    }

    async putProfilephoto({params, response, request}){
        //Check user_id
        const user_id = await User.findBy('id', params.id);
        if (user_id == null) {
            return response.status(406).json({"message":"User not found"})
        }
        const image = request.file('image', {type:['image'], size:'2mb'});
        const newName = `${Date.now()}${user_id.id}.${image.extname}`;

        await image.move(Helpers.tmpPath('profiles'), {
            name: newName
        });

        if (!image.move()) {
            return images.erro();
        }
        
        //Deleta - resolver o warning
        try {
            await Drive.delete(Helpers.tmpPath(`profiles/${user_id.profile_photo}`))
        } catch (error) {
            console.log(error);
        }

        //Novo nome na tabela
        await User.query().where({id:params.id}).update({profile_photo: newName})

        return image;
    }

    async authentication({request, auth}){
        const {email, password} = request.all();
        const token = await auth.attempt(email, password);
        return token;
    }

    async logout({auth}){
        await auth.logout()
        return true;
    }

    async update({request, response, params}){
        const user = await User.findBy('id', params.id);
        if (user == null) {
            return response.send({"messager":"User not found"});
        }

        const data = request.only(['username', 'name', 'address', 'id_center', 'website', 'type', 'email', 'password'])        
        user.merge(data);
        user.save();
        return user;
    }

    async delete({response, params}){
        const user = await User.findBy('id', params.id);
        if (user == null) {
            return response.send({"messager":"User not found"});
        }
        if (user.username == 'root') {
            return response.send({"messager":"This user cannot be deleted"});            
        }
        user.delete();
    }
}

module.exports = UserController
