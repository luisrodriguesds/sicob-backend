'use strict'

const User = use('App/Models/User');
const Centro = use('App/Models/Center');

class UserController {
    async index(){
        const users = await User.query().with('center').fetch();
        return users;
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
