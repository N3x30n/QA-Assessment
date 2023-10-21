const shuffle = require("../src/shuffle");

let testArr = [8,2,5,7,9,4,12]

describe("shuffle should...", () => {
  // CODE HERE
  test('shuffle should return an array with the same length as the argument', () => {
    shuffle(testArr)
    expect(shuffle(testArr)).toHaveLength(7)
  })

  test('shuffle should return a shuffled array', () => {
    let shuffledArr = shuffle(testArr)
    expect(shuffledArr).not.toEqual(testArr)
  })
});
