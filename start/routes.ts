/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const InvoicesController = () => import('#controllers/invoices_controller')

router.resource('invoices', InvoicesController).apiOnly()
router.on('/inertia').renderInertia('home', { version: 6 })
