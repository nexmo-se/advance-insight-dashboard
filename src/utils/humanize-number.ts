interface HumanizeOptions {
  number: number;
  treshold?: number;
}

class HumanizeNumber {
  static ALPHABET = 'KMGTPEZY'.split('');

  static humanize ({ number, treshold = 1e4 }: HumanizeOptions): string | number {
    let index = 0;
    while (number >= treshold && ++index < HumanizeNumber.ALPHABET.length) {
      number /= treshold;
    }

    return index === 0? number.toFixed(2): number.toFixed(2) + HumanizeNumber.ALPHABET[index - 1];
  }
}

export default HumanizeNumber;
