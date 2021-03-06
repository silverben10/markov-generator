/** Class representing a Markov Chain generator */
class Markov {
  /**
   * Builds the generator
   * @param {object} props - The configuration options and input data
   */
  constructor(props) {
    this.props = props;
    if (!this.props.input) {
      throw new Error("input was empty!");
    }
    this.terminals = {};
    this.startWords = [];
    this.wordStats = {};
    this.bannedTerminals =
      props.bannedTerminals && props.bannedTerminals.length
        ? props.bannedTerminals.map((word) => word.toLowerCase())
        : [];

    this.props.input.forEach((e) => {
      const words = e.split(" ");
      const lastWord = words[words.length - 1];
      const firstWord = words[0];

      // if this.terminals contains the last word in this sentence, add to it's counter
      // otherwise, create the property on this.terminals and set it to 1
      if (this.terminals[lastWord]) {
        this.terminals[lastWord] += 1;
      } else {
        this.terminals[lastWord] = 1;
      }

      // this function tests to see if this.startWords already contains the first word or not
      // we can't use Array.prototype.includes, because when comparing each element in this.startWords to the first word, we need to compare them as lowercase
      const checkWordNotInStartWords = (refWord) => {
        for (const word of this.startWords) {
          if (word.toLowerCase() === refWord.toLowerCase()) {
            return false;
          }
        }

        return true;
      };

      // if the first word is not a space, and if this.startWords does not already contain the first word, add it
      if (firstWord.length && checkWordNotInStartWords(firstWord)) {
        this.startWords.push(firstWord);
      }

      // loop through each word in current sentence
      words.forEach((el, it, ar) => {
        // if this.wordStats already contains the current word in the sentence as a property, push the next word in the sentence to it's array
        // otherwise, create the property on this.startWords and set it to an array containing the next word in the sentence
        // first check to see if there even IS a next word
        // we store all of the keys in this.wordStats as lowercase to make the function makeChain case insensitive
        if (ar[it + 1]) {
          if (Object.prototype.hasOwnProperty.call(this.wordStats, el.toLowerCase())) {
            this.wordStats[el.toLowerCase()].push(ar[it + 1]);
          } else {
            this.wordStats[el.toLowerCase()] = [ar[it + 1]];
          }
        }
      });
    });

    for (const word in this.terminals) {
      if (this.terminals[word] === "" || !this.terminals[word]) {
        delete this.terminals[word];
      }
    }

    delete this.terminals[""];
    delete this.wordStats[""];
  }

  isBannedTerminal(word) {
    return this.bannedTerminals.includes(word.toLowerCase());
  }

  /**
   * Choose a random element in a given array
   * @param {array} a - An array to randomly choose an element from
   * @return {string} The selected element of the array
   */
  static choice(a) {
    return a[Math.floor(a.length * Math.random())];
  }

  /**
   * Creates a new string via a Markov chain based on the input array from the constructor
   * @param {number} minLength - The minimum number of words in the generated string
   * @return {string} The generated string
   */
  makeChain(minLength = this.props.minLength || 10) {
    let word = this.choice(this.startWords);
    const chain = [word];

    while (Object.prototype.hasOwnProperty.call(this.wordStats, word.toLowerCase())) {
      const nextWords = this.wordStats[word.toLowerCase()];
      word = this.choice(nextWords);
      chain.push(word);
      if (
        chain.length > minLength &&
        Object.prototype.hasOwnProperty.call(this.terminals, word) &&
        !this.isBannedTerminal(word)
      ) {
        break;
      }
    }
    if (this.props.input.includes(chain.join(" "))) {
      return this.makeChain(minLength);
    }
    if (chain.length < minLength) {
      return this.makeChain(minLength);
    }
    return chain.join(" ");
  }
}

module.exports = Markov;
