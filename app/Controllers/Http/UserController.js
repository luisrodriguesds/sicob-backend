'use strict'

const User = use('App/Models/User');
const Centro = use('App/Models/Centro');

class UserController {
    async index(){
        const users = await User.query().with('centro').fetch();
        return users;
    }

    async create({request, response}){
        const data = request.only(['username', 'nome', 'endereco', 'id_centro', 'site', 'tipo', 'email', 'password'])
        
        //Verificar se o centro existe
        //Verificar se o centro passado existe
        const centro = await Centro.findBy('id', data.id_centro);
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

    async update({request, response, params}){
        const user = await User.findBy('id', params.id);
        if (user == null) {
            return response.send({"messager":"User not found"});
        }
        const data = request.only(['username', 'nome', 'endereco', 'id_centro', 'site', 'tipo', 'email', 'password']);
        user.merge(data);
        user.save();
        return user;
    }

    async delete({request, params}){
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
