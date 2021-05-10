export interface CharacterStream {
  read(): string
}

export class StringCharacterStream implements CharacterStream {
  private index = 0
  constructor(private value: string) {}

  read() {
    return this.value[this.index++]
  }
}
