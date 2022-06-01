import { expect } from 'chai';
import { Sparsely, ConfigOption } from '../lib';
import testOptions from './test-options';

// This suite tests to ensure that
// a verbose option that accepts
// an argument is parsed correctly:
describe('argv = ["--option-B", "arg1"]', () => {
  const parser = new Sparsely();

  testOptions.forEach((option: ConfigOption) => {
    parser.addOption(option);
  });

  const argv = [ '--option-B', 'arg1' ];
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
    const expected = 1;
    it(`should return an array of length ${expected}`, () => {
      const parsedOptions = parser.parsedOptions;
      expect(parsedOptions).to.have.lengthOf(expected);
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
});

// This suite tests to ensure that
// a shorthand option that accepts
// an argument is parsed correctly:
describe('argv = ["-B", "arg1"]', () => {
  const parser = new Sparsely();

  testOptions.forEach((option: ConfigOption) => {
    parser.addOption(option);
  });

  const argv = [ '-B', 'arg1' ];
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
    const expected = 1;
    it(`should return an array of length ${expected}`, () => {
      const parsedOptions = parser.parsedOptions;
      expect(parsedOptions).to.have.lengthOf(expected);
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
});

// This suite tests to ensure that
// a verbose option is parsed correctly
// when insufficient arguments are 
// provided to it (appropriate error
// messages are generated):  
describe('argv = ["--option-B"]', () => {
  const parser = new Sparsely();

  testOptions.forEach((option: ConfigOption) => {
    parser.addOption(option);
  });

  const argv = [ '--option-B' ];
  parser.exec(argv);

  describe('errors', () => {
    const expected = 1;
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
// a shorthand option is parsed correctly
// when insufficient arguments are provided
// to it (appropriate error messages are
// generated):
describe('argv = ["-B"]', () => {
  const parser = new Sparsely();

  testOptions.forEach((option: ConfigOption) => {
    parser.addOption(option);
  });

  const argv = [ '-B' ];
  parser.exec(argv);

  describe('errors', () => {
    const expected = 1;
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