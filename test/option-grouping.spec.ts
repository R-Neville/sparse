import { expect } from 'chai';
import { Sparsely, ConfigOption } from '../lib';
import testOptions from './test-options';

// This suite tests to ensure that
// a group of non-groupable options
// is parsed correctly:
describe('argv = ["-AF"]', () => {
  const parser = new Sparsely();

  testOptions.forEach((option: ConfigOption) => {
    parser.addOption(option);
  });

  const argv = [ '-AF' ];
  parser.exec(argv);

  describe('errors', () => {
    const expected = 2;
    it(`should return an array of length ${expected}`, () => {
      const errors = parser.errors;
      expect(errors).to.have.lengthOf(expected);
    });
  });

  describe('parsedArgs', () => {
    const expected = 0;
    it(`should return an array of length ${expected}`, () => {
      const parsedArgs = parser.parsedArgs;
      expect(parsedArgs).to.have.lengthOf(expected);
    });
  });

  describe('parsedOptions', () => {
    const expected = 0;
    it(`should return an array of length ${expected}`, () => {
      const parsedOptions = parser.parsedOptions;
      expect(parsedOptions).to.have.lengthOf(expected);
    });
  });
});

// This suite tests to ensure that 
// a group of groupable options is
// parsed correctly:
describe('', () => {
  const parser = new Sparsely();

  testOptions.forEach((option: ConfigOption) => {
    parser.addOption(option);
  });

  const argv = [ '-ED' ];
  parser.exec(argv);

  describe('errors', () => {
    const expected = 0;
    it(`should return an array of length ${expected}`, () => {
      const errors = parser.errors;
      expect(errors).to.have.lengthOf(expected);
    });
  });

  describe('parsedArgs', () => {
    const expected = 0;
    it(`should return an array of length ${expected}`, () => {
      const parsedArgs = parser.parsedArgs;
      expect(parsedArgs).to.have.lengthOf(expected);
    });
  });

  describe('parsedOptions', () => {
    const expected = 2;
    it(`should return an array of length ${expected}`, () => {
      const parsedOptions = parser.parsedOptions;
      expect(parsedOptions).to.have.lengthOf(expected);
    });
  });

  describe('isParsedOption', () => {
    const expected = true;
    const arg = 'option-D';
    it(`Should return ${expected} with an argument of ${arg}`, () => {
      const result = parser.isParsedOption(arg);
      expect(result).to.be.true;
    });
  });

  describe('isParsedOption', () => {
    const expected = true;
    const arg = 'option-E';
    it(`Should return ${expected} with an argument of ${arg}`, () => {
      const result = parser.isParsedOption(arg);
      expect(result).to.be.true;
    });
  });
});