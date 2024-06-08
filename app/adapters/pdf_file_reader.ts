import { readFile } from 'node:fs/promises'

import { extractText, getDocumentProxy } from 'unpdf'

import { TextFileReader, type Path } from '#types/text_file_reader'

export class PdfFileReader implements TextFileReader {
  async read(path: Path): Promise<string> {
    const buffer = await readFile(path)
    const pdf = await getDocumentProxy(new Uint8Array(buffer))
    let { text } = await extractText(pdf, { mergePages: true })
    text = text.toString()

    return text
  }
}
