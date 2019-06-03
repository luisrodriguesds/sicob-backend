'use strict'

const User          = use('App/Models/User');
const Centro        = use('App/Models/Center');
const Helpers       = use('Helpers');
const Drive         = use('Drive');
const RequestPass   = use('App/Models/RequestPass');
const Hash          = use('Hash')
const Mail          = use('Mail');
class UserController {
    
    async index(){
        const users = await User.query().with('center').fetch();
        
        return users.toJSON();
    }
    
    async show({params}){
        const user = await User.findBy('id', params.id);
        try {
            user.load('center');
        } catch (error) {
            return user;
        }
        return user;
    }
    
    async token({auth}){
        const user = await User.findBy('id', auth.user.id);
        user.load('center');
        return user;
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

    async putProfilephoto_old({params, response, request}){
        //Check user_id
        const user_id = await User.findBy('id', params.id);
        if (user_id == null) {
            return response.status(406).json({"message":"User not found"})
        }
        const image = request.file('image', {type:['image'], size:'2mb'});
        const newName = `${Date.now()}${user_id.id}.${image.extname}`;

        const url = 'http://aguabacabal.com.br/tmp/profile-photo.php';
        
        var req = request.post(url, function (err, resp, body) {
            if (err) {
                console.log('Error!');
            } else {
                console.log('URL: ' + body);
            }
        });

        var form = req.form();
        form.append('file', '<FILE_DATA>', {
            filename: newName,
            contentType: image.type+'/'+image.subtype
        });

        return image;
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
        await user.save();
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

    async requestNewPass({params, response}){
        const email = (params.email == undefined) ? 0 : params.email;
        const user  = await User.findBy('email', email);
        const key   = await Hash.make(`${email}-${Math.random()*10000}`);
        
        if(user == null){
            return response.status(406).json({"message":"User not found"})
        }

        user.key = key;
        user.link = 'http://localhost:3000/recuperar-senha?token='+key;
        // await Mail.send('emails.welcome', user.toJSON(), (message) => {
        //     message
        //         .to(user.email)
        //         .from('<from-email>')
        //         .subject('SICOB - UFC | Recuperação de Senha')
        //     })
        
        await RequestPass.create({user_id:user.id, key});
        return key;
    }

    async setNewPass({request, response}){
        const {token, password}  = request.only(['token', 'password']);
        const data = {password};
        const req   = await RequestPass.findBy('key', token);

        if (req == null) {
            return response.status(406).json({"message":"Token not found"})            
        }
        //Comparar as datas
        const currentDate   = new Date();
        const rowDate       = new Date(req.created_at);
        let dif             = currentDate - rowDate;
            dif             = Math.floor(dif/(1000*60*60));

        if (dif >= 2) {
            return response.status(406).json({"message":"Invalid token"})         
        }
        console.log(req.user_id);
        const user = await User.findBy('id', req.user_id);
        user.merge(data);
        await user.save();

        //apagar token
        await req.delete();
        return user;
    }


}

module.exports = UserController
