const { expect } = require('chai');
const Sparse = require('../lib/Sparse');
const testOptions = require('./test-options.json');

describe('Sparse (without test options)', () => {

  const parser = new Sparse();

  describe('options', () => {
    it ('should return an empty array when no options have been added', () => {
      const options = parser.options;
      expect(options).to.have.lengthOf(0);
    });
  });

  describe('parsedArgs', () => {
    it('should return an empty array when exec has not been called', () => {
      const parsedArgs = parser.parsedArgs;
      expect(parsedArgs).to.have.lengthOf(0);
    });
  });

  describe('parsedOptions', () => {
    it('should return an empty array when exec has not been called', () => {
      const parsedOptions = parser.parsedOptions;
      expect(parsedOptions).to.have.lengthOf(0);
    });
  });

  describe('errors', () => {
    it('should return an empty array when exec has not been called', () => {
      const errors = parser.errors;
      expect(errors).to.have.lengthOf(0);
    });
  });
});

describe('Sparse (with test options)', () => {
  const parser = new Sparse();

  testOptions.forEach(option => {
    parser.addOption(option);
  });

  describe('argv = ["-A"]', () => {
    const argv = ['-A'];
    parser.exec(argv);

    describe('options', () => {
      it(`should return an array of length ${testOptions.length}`, () => {
        const options = parser.options;
        expect(options).to.have.lengthOf(testOptions.length);
      });
    });

    describe('errors', () => {
      it(`should return an array of length 0`, () => {
        const errors = parser.errors;
        expect(errors).to.have.lengthOf(0);
      });
    });

    describe('parsedArgs', () => {
      it(`should return an array of length 0`, () => {
        const parsedArgs = parser.parsedArgs;
        expect(parsedArgs).to.have.lengthOf(0);
      });
    });

    describe('parsedOptions', () => {
      it('should return an array of length 1', () => {
        const parsedOptions = parser.parsedOptions;
        expect(parsedOptions).to.have.lengthOf(1);
      });
    });
  });
});