import { join } from 'node:path'
import { readdir } from 'node:fs/promises'

import { PdfFileReader } from '#adapters/pdf_file_reader'
import { CemigInvoiceReader } from '#services/cemig_invoice_reader'
import { type TextFileReader } from '#types/text_file_reader'
import { type InvoiceReader } from '#types/invoice_reader'

export class TestService {
  private textFileReader: TextFileReader

  constructor() {
    this.textFileReader = new PdfFileReader()
  }

  async perform() {
    // should be moved to a service or maybe a repository
    const basePath = join(process.cwd(), '/database/seeders/invoices')
    let invoices = await readdir(basePath, { recursive: true })
    invoices = invoices
      .filter((file) => {
        if (file.startsWith('.') || !file.endsWith('.pdf')) {
          return false
        }

        return true
      })
      .map((path) => {
        return join(basePath, path)
      })

    const text = await this.textFileReader.read(invoices[0])
    const invoiceReader: InvoiceReader = new CemigInvoiceReader(text)
    const entity = {
      ...invoiceReader.getInvoiceData(),
      installation: invoiceReader.getInstallationData(),
      customer: invoiceReader.getCustomerData(),
      consumptionDetail: invoiceReader.getConsumptionDetailData(),
    }
    console.log('entity', entity)
  }
}
