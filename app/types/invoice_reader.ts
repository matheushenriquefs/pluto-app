export interface InvoiceReader {
    getText(): string
    setText(text: string): string
    normalize(text: string): string
    getInvoiceData(): any
    getInstallationData(): any
    getCustomerData(): any
    getConsumptionDetailData(): any
}
