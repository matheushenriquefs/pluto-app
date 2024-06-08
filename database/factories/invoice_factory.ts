import factory from '@adonisjs/lucid/factories'
import Invoice from '#models/invoice'

export const InvoiceFactory = factory
  .define(Invoice, async ({ faker }) => {
    return {}
  })
  .build()