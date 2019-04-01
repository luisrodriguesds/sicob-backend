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

//Routes od users
Route.get('/api/user', 'UserController.index').middleware(['auth', 'ManagerCustom']);
Route.post('/api/user', 'UserController.create').middleware(['auth', 'ManagerCustom']);
Route.put('/api/user/:id', 'UserController.update').middleware(['auth', 'OwnerOrManager']);
Route.delete('/api/user/:id', 'UserController.delete').middleware(['auth', 'OwnerOrManager']);
Route.post('/api/auth', 'UserController.authentication');

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
  Route.get('/api/product/', 'ProductController.index')
  Route.post('/api/product', 'ProductController.store').middleware(['auth'])
  Route.post('/api/product/:id/images', 'ImageController.store').middleware(['auth'])
  Route.get('/api/images/:path', 'ImageController.show')
  Route.get('/api/product/:id', 'ProductController.show')
  Route.get('/api/product/search/:name', 'ProductController.search')
  Route.put('/api/product/:id', 'ProductController.update').middleware(['auth'])
  Route.delete('/api/product/:id', 'ProductController.destroy').middleware(['auth'])
})
