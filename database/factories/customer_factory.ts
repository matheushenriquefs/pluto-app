import factory from '@adonisjs/lucid/factories'
import Customer from '#models/customer'

export const CustomerFactory = factory
  .define(Customer, async ({ faker }) => {
    return {}
  })
  .build()