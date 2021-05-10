export class DataHandler {
  /**
   * 
   * @param {string} delimiter 
   */
  constructor(delimiter) {
    this.delimiter = delimiter;
    this.buffer = "";
  }

  isEmpty() {
    return this.buffer.length === 0 || this.buffer.indexOf(this.delimiter) === -1;
  }

  push(data) {
    this.buffer += data;
  }

  getData() {
    const delimiterIndex = this.buffer.indexOf(this.delimiter)
    if (delimiterIndex !== -1) {
      const data = this.buffer.substring(0, delimiterIndex)
      this.buffer = this.buffer.substring(delimiterIndex + this.delimiter.length)
      return JSON.parse(data)
    }
    return null
  }
}