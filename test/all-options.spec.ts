import { expect } from 'chai';
import { Sparsely, ConfigOption } from '../lib';
import testOptions from './test-options';

// This suite tests to ensure that
// all types of arguments are parsed
// correctly:
describe('argv = ["-AF", "--option-B", "option-B-arg", "--option-C=arg", "program-arg-1", "program-arg-2", "-G", "option-G-arg-1", "option-G-arg-2", "-E", "-D"]', () => {
  const parser = new Sparsely();

  testOptions.forEach((option: ConfigOption) => {
    parser.addOption(option);
  });

  const argv = [ 
    '-ED', 
    '--option-B', 
    'option-B-arg',
    '--option-C=arg',
    'program-arg-1',
    'program-arg-2',
    '-G',
    'option-G-arg-1',
    '-A',
    '-F'
  ];
  parser.exec(argv);

  describe('errors', () => {
    const expected = 0;
    it(`should return an array of length ${expected}`, ()=> {
      const errors = parser.errors;
      expect(errors).to.have.lengthOf(expected);
    });
  });

  describe('parsedArgs', () => {
    const expected = 2;
    it(`should return an array of length ${expected}`, () => {
      const parsedArgs = parser.parsedArgs;
      expect(parsedArgs).to.have.lengthOf(expected);
    });
  });

  describe('parsedOptions', () => {
    const expected = 7;
    it(`should return an array of length ${expected}`, () => {
      const parsedOptions = parser.parsedOptions;
      expect(parsedOptions).to.have.lengthOf(expected);
    });
  });

  describe('isParsedOption', () => {
    const expected = true;
    const arg = 'option-A';
    it(`should return ${expected} with an argument of ${arg}`, () => {
      const result = parser.isParsedOption(arg);
      expect(result).to.be.true;
    });
  });

  describe('isParsedOption', () => {
    const expected = true;
    const arg = 'option-B';
    it(`should return ${expected} with an argument of ${arg}`, () => {
      const result = parser.isParsedOption(arg);
      expect(result).to.be.true;
    });
  });

  describe('isParsedOption', () => {
    const expected = true;
    const arg = 'option-C';
    it(`should return ${expected} with an argument of ${arg}`, () => {
      const result = parser.isParsedOption(arg);
      expect(result).to.be.true;
    });
  });

  describe('isParsedOption', () => {
    const expected = true;
    const arg = 'option-D';
    it(`should return ${expected} with an argument of ${arg}`, () => {
      const result = parser.isParsedOption(arg);
      expect(result).to.be.true;
    });
  });

  describe('isParsedOption', () => {
    const expected = true;
    const arg = 'option-E';
    it(`should return ${expected} with an argument of ${arg}`, () => {
      const result = parser.isParsedOption(arg);
      expect(result).to.be.true;
    });
  });

  describe('isParsedOption', () => {
    const expected = true;
    const arg = 'option-F';
    it(`should return ${expected} with an argument of ${arg}`, () => {
      const result = parser.isParsedOption(arg);
      expect(result).to.be.true;
    });
  });

  describe('isParsedOption', () => {
    const expected = true;
    const arg = 'option-G';
    it(`should return ${expected} with an argument of ${arg}`, () => {
      const result = parser.isParsedOption(arg);
      expect(result).to.be.true;
    });
  });

  describe('isParsedArg', () => {
    const expected = true;
    const arg = 'program-arg-1';
    it(`should return ${expected} with an argument of ${arg}`, () => {
      const result = parser.isParsedArg(arg);
      expect(result).to.be.true;
    });
  });

  describe('isParsedArg', () => {
    const expected = true;
    const arg = 'program-arg-2';
    it(`should return ${expected} with an argument of ${arg}`, () => {
      const result = parser.isParsedArg(arg);
      expect(result).to.be.true;
    });
  });
});