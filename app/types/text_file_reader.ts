import { type PathLike } from 'node:fs'
import { type FileHandle } from 'node:fs/promises'

export type Path = PathLike | FileHandle

export interface TextFileReader {
  read(path: Path): Promise<string>
}
