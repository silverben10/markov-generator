const { expect, describe, it } = require("chai");
const MarkovGen = require("../index.js");

describe("Markov Chain Generator", () => {
  let testInput = [
    "Test sentence number 1",
    "This is another test sentence",
    "I'm test sentence number two!",
    "I can't believe that this is another test",
    "TEST of insensitive",
  ];

  it("throws with no input", () => {
    const fn = () => new MarkovGen({});
    expect(fn).to.throw(Error);
  });

  it("returns a string", () => {
    const string = new MarkovGen({
      input: testInput,
      minLength: 2,
    }).makeChain();
    expect(string).to.not.equal("");
  });

  it("returns a string with a minimum amount of words set to the configuration variable", () => {
    const minlenstr = new MarkovGen({
      input: testInput,
      minLength: 3,
    }).makeChain();
    const minlenarr = minlenstr.split(" ");
    expect(minlenarr.length).to.be.at.least(3);
  });

  it("returns a string with a minimum amount of words set to a default value", () => {
    const minlenstr = new MarkovGen({
      input: testInput,
    }).makeChain();
    const minlenarr = minlenstr.split(" ");
    expect(minlenarr.length).to.be.at.least(10);
  });

  it("returns a string with a minimum amount of words set to an override value", () => {
    const minlenstr = new MarkovGen({
      input: testInput,
      minLength: 1,
    }).makeChain(5);
    const minlenarr = minlenstr.split(" ");
    expect(minlenarr.length).to.be.at.least(5);
  });

  it("returns a string with proper letter casing", () => {
    testInput = ["Test seNtence", "anothEr teSt sentenCe", "A thIRd tEST seNtence"];
    const string = new MarkovGen({
      input: testInput,
      minLength: 2,
    }).makeChain();
    expect(string).to.not.equal(string.toLowerCase());
  });
});
