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
Route.post('/api/user', 'UserController.create')
// .middleware(['auth', 'ManagerCustom']);
Route.put('/api/user/:id', 'UserController.update').middleware(['auth', 'OwnerOrManager']);
Route.delete('/api/user/:id', 'UserController.delete').middleware(['auth', 'OwnerOrManager']);
Route.post('/api/auth', 'UserController.authentication');

//Centro
Route.group(()=>{
  Route.get('/api/centro', 'CentroController.index');
  Route.post('/api/centro', 'CentroController.store').middleware(['auth', 'ManagerCustom']);
  Route.get('/api/centro/:id', 'CentroController.show');
  Route.put('/api/centro/:id', 'CentroController.update').middleware(['auth', 'ManagerCustom']);
  Route.delete('/api/centro/:id', 'CentroController.destroy').middleware(['auth', 'ManagerCustom']);
});


