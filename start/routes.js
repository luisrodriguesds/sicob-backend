'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */

const Route = use('Route')

Route.get('/api', ({response, request}) => {
  return response.json({"message":"API it's working!"})
});

//Users
Route.group(()=>{
  Route.get('/api/user', 'UserController.index').middleware(['auth', 'ManagerCustom']);
  Route.get('/api/user/logout', 'UserController.logout').middleware(['auth']);
  Route.get('/api/user/show/:id', 'UserController.show').middleware(['auth', 'OwnerOrManager']);
  Route.get('/api/user/token', 'UserController.token').middleware(['auth']);
  
  Route.get('/api/user/profilephoto/:path', 'UserController.showProfilephoto');
  Route.post('/api/user/profilephoto/:id', 'UserController.profilephoto').middleware(['auth', 'OwnerOrManager']);
  Route.put('/api/user/profilephoto/:id', 'UserController.putProfilephoto').middleware(['auth', 'OwnerOrManager']);
  
  Route.post('/api/user/', 'UserController.create').middleware(['auth', 'ManagerCustom']);
  Route.put('/api/user/:id', 'UserController.update').middleware(['auth', 'OwnerOrManager']);
  Route.delete('/api/user/:id', 'UserController.delete').middleware(['auth', 'ManagerCustom']);
  Route.post('/api/auth', 'UserController.authentication');
  Route.get('/api/user/requestNewPass/:email', 'UserController.requestNewPass');
  Route.post('/api/user/setNewPass/', 'UserController.setNewPass');
  Route.put('/api/user/changePass/:id', 'UserController.changePass').middleware(['auth', 'OwnerOrManager']);
});

//Centro
Route.group(()=>{
  Route.get('/api/center', 'CenterController.index');
  Route.post('/api/center', 'CenterController.store').middleware(['auth', 'ManagerCustom']);
  Route.get('/api/center/:id', 'CenterController.show');
  Route.put('/api/center/:id', 'CenterController.update').middleware(['auth', 'ManagerCustom']);
  Route.delete('/api/center/:id', 'CenterController.destroy').middleware(['auth', 'ManagerCustom']);
});

//Category
Route.group(() => {
  Route.get('/api/category', 'CategoryController.index')
  Route.post('/api/category', 'CategoryController.store').middleware(['auth', 'ManagerCustom'])
  Route.get('/api/category/:id', 'CategoryController.show')
  Route.get('/api/category/search/:name', 'CategoryController.search')
  Route.put('/api/category/:id', 'CategoryController.update').middleware(['auth', 'ManagerCustom'])
  Route.delete('/api/category/:id', 'CategoryController.destroy').middleware(['auth', 'ManagerCustom'])
})

//Subcategory
Route.group(() => {
  Route.get('/api/subcategory/:id', 'SubcategoryController.index')
  Route.post('/api/subcategory', 'SubcategoryController.store').middleware(['auth', 'ManagerCustom'])
  Route.get('/api/subcategory/show/:id', 'SubcategoryController.show')
  Route.get('/api/subcategory/search/:name/:category_id', 'SubcategoryController.search')
  Route.put('/api/subcategory/:id', 'SubcategoryController.update').middleware(['auth', 'ManagerCustom'])
  Route.delete('/api/subcategory/:id', 'SubcategoryController.destroy').middleware(['auth', 'ManagerCustom'])
})

//Produtcs
Route.group(() => {
  Route.get('/api/product/index/', 'ProductController.index')
  Route.get('/api/product/index/:page', 'ProductController.index')
  Route.get('/api/product/index/:page/:perPage', 'ProductController.index')
  Route.get('/api/product/search', 'ProductController.search')
  Route.get('/api/product/search/:page', 'ProductController.search')
  Route.get('/api/product/historic/', 'ProductController.historic').middleware(['auth'])
  Route.get('/api/product/historicAll/', 'ProductController.historicAll').middleware(['auth'])
  Route.post('/api/product', 'ProductController.store').middleware(['auth'])
  Route.post('/api/product/:id/images', 'ImageController.store').middleware(['auth'])
  Route.get('/api/images/:path', 'ImageController.show')
  Route.delete('/api/images/:id', 'ImageController.destroy').middleware(['auth'])
  Route.get('/api/product/show/:id', 'ProductController.show')
  Route.put('/api/product/:id', 'ProductController.update').middleware(['auth'])
  Route.delete('/api/product/:id', 'ProductController.destroy').middleware(['auth'])
})

//Solicitations
Route.group(()=>{
  Route.get('/api/solicitation', 'SolicitationController.index');
  Route.get('/api/solicitation/historicAll', 'SolicitationController.historicAll').middleware(['auth']); //Show all soliciations
  // Route.get('/api/solicitation', 'SolicitationController.index').middleware(['auth']);
  Route.post('/api/solicitation', 'SolicitationController.store').middleware(['auth']);
  Route.get('/api/solicitation/:product_id', 'SolicitationController.show');  //Show all soliciation of this produtc
  Route.get('/api/solicitation/:product_id/:user_id', 'SolicitationController.show');  // Show just unique solicitation
  Route.put('/api/solicitation/:id', 'SolicitationController.update').middleware(['auth']);
  Route.delete('/api/solicitation/:id', 'SolicitationController.destroy').middleware(['auth']);
});
