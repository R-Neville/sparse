import { expect } from 'chai';
import { Sparsely, ConfigOption } from '../lib';
import testOptions from './test-options';

// This suite tests to ensure that
// multiple serparate verbose options
// are parsed correctly:
describe('argv = ["--option-A", "--option-F"]', () => {
  const parser = new Sparsely();
  testOptions.forEach((option: ConfigOption) => {
    parser.addOption(option);
  });

  const argv = [ '--option-A', '--option-F' ];
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
});

// This suite tests to ensure that
// multiple serparate shorthand options
// are parsed correctly:
describe('argv = ["-A", "-F"]', () => {
  const parser = new Sparsely();
  testOptions.forEach((option: ConfigOption) => {
    parser.addOption(option);
  });

  const argv = [ '-A', '-F' ];
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
});