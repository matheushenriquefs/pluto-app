import dayjs from 'dayjs'

import { type InvoiceReader } from '#types/invoice_reader'

export class CemigInvoiceReader implements InvoiceReader {
  private text: string

  constructor(text: string) {
    this.text = this.setText(text)
  }

  getText(): string {
    return this.text
  }

  setText(text: string): string {
    this.text = this.normalize(text)

    return this.text
  }

  normalize(text: string): string {
    return text
      .trim()
      .toLowerCase()
      .replace(/(\r\n|\n|\r)/g, ' ') // remove line breaks
      .replace(/\s+/g, ' ') // remove multiple consecutive spaces
      .replace(/(\d{1,3}(\.\d{3})*)(,\d+)/g, (match) => {
        // format numbers
        return match.replace(/\./g, '').replace(',', '.')
      })
  }

  getInvoiceData() {
    let invoice = null
    const amountMatch = this.text.match(/total (\d+\.\d+)/i)

    if (!amountMatch) {
      return invoice
    }

    invoice = {
      amount: Number(amountMatch[1]),
      referenceDate: '',
      dueDate: '',
    }
    const referenceDateMatch = this.text.match(/(?<=\breferente a\b.*?)(\w{3,}\/\d{4,})/i)

    if (!referenceDateMatch) {
      return invoice
    }

    const referenceDate = dayjs(referenceDateMatch[0]).toJSON()
    invoice.referenceDate = referenceDate

    const dueDateMatch = this.text.match(/(?<=\bvencimento\b.*?)(\d{2}\/\d{2}\/\d{4,})/i)

    if (!dueDateMatch) {
      return invoice
    }

    let dueDate = dayjs(dueDateMatch[0])
    const date = dueDate.get('month') + 1
    const month = dueDate.get('date') - 1
    dueDate = dueDate.set('date', date).set('month', month)
    invoice.dueDate = dueDate.toJSON()

    return invoice
  }

  getInstallationData() {
    let installation = null
    const installationNumberMatch = this.text.match(/nº da instalação\s*(\d+)\s*(\d+)/i)

    if (!installationNumberMatch) {
      return installation
    }

    installation = {
      code: Number(installationNumberMatch[2]),
    }

    return installation
  }

  getCustomerData() {
    let customer = null
    const customerNumberMatch = this.text.match(/nº do cliente\s*nº da instalação\s*(\d+)\s*(\d+)/i)

    if (!customerNumberMatch) {
      return customer
    }

    customer = {
      code: Number(customerNumberMatch[1]),
    }

    return customer
  }

  getConsumptionDetailData() {
    const consumptionDetail = []
    const electricityConsumptionMatch = this.text.match(
      /energia elétrica kwh (\d+) \S+ (\d+\.\d+)/i
    )

    if (electricityConsumptionMatch) {
      const [, quantity, value] = electricityConsumptionMatch
      consumptionDetail.push({
        type: 'electricity',
        quantity: Number(quantity),
        value: Number(value),
      })
    }

    const injectedElectricityMatch = this.text.match(
      /energia injetada hfp kwh (\d+) \S+ (-?\d+\.\d+)/i
    )

    if (injectedElectricityMatch) {
      const [, quantity, value] = injectedElectricityMatch
      consumptionDetail.push({
        type: 'injected-electricity',
        quantity: Number(quantity),
        value: Number(value),
      })
    }

    const compensatedElectricityWithoutTaxesMatch = this.text.match(
      /en comp\. s\/ icms kwh (\d+) \S+ (\d+\.\d+)/i
    )

    if (compensatedElectricityWithoutTaxesMatch) {
      const [, quantity, value] = compensatedElectricityWithoutTaxesMatch
      consumptionDetail.push({
        type: 'compensated-electricity-without-taxes',
        quantity: Number(quantity),
        value: Number(value),
      })
    }

    const publicLightingContributionMatch = this.text.match(
      /contrib ilum publica municipal (\d+\.\d+)/i
    )

    if (publicLightingContributionMatch) {
      const [, value] = publicLightingContributionMatch
      consumptionDetail.push({
        type: 'public-contributed-electricity',
        quantity: 1,
        value: Number(value),
      })
    }

    return consumptionDetail.length ? consumptionDetail : null
  }
}
