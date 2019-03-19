'use strict'

const User = use('App/Models/User');

class UserController {
    async index(){
        const users = await User.all();
        return users;
    }

    async create({request}){
        const data = request.only(['username', 'nome', 'endereco', 'id_centro', 'site', 'tipo', 'email', 'password'])
        
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
