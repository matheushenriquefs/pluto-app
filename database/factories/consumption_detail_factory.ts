import factory from '@adonisjs/lucid/factories'
import ConsumptionDetail from '#models/consumption_detail'

export const ConsumptionDetailFactory = factory
  .define(ConsumptionDetail, async ({ faker }) => {
    return {}
  })
  .build()