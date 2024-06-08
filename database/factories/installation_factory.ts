import factory from '@adonisjs/lucid/factories'
import Installation from '#models/installation'

export const InstallationFactory = factory
  .define(Installation, async ({ faker }) => {
    return {}
  })
  .build()