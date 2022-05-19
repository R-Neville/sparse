const { expect } = require('chai');
const Sparsely = require('../lib/Sparsely');
const testOptions = require('./test-options.json');

describe('Sparse (without test options)', () => {

  const parser = new Sparsely();

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
  // This suite simply tests that options
  // are added correctly via the addOption
  // method:
  describe('options', () => {
    const parser = new Sparsely();

    testOptions.forEach(option => {
      parser.addOption(option);
    });

    it(`should return an array of length ${testOptions.length}`, () => {
      const options = parser.options;
      expect(options).to.have.lengthOf(testOptions.length);
    });
  });

  // This suite tests the scenario where only arguments
  // have been passed to the program using Sparse:
  describe('argv = ["arg1", "arg2", "arg3"]', () => {
    const parser = new Sparsely();

    testOptions.forEach(option => {
      parser.addOption(option);
    });

    const argv = [ 'arg1', 'arg2', 'arg3' ];
    parser.exec(argv);

    describe('errors', () => {
      const expected = 0;
      it(`should return an array of length ${expected}`, () => {
        const errors = parser.errors;
        expect(errors).to.have.lengthOf(expected);
      });
    });

    describe('parsedArgs', () => {
      const expected = argv.length;
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
  // a single shorthand option that 
  // does not accept arguments is 
  // parsed correctly in verbose form:
  describe('argv = ["--option-A"]', () => {
    const parser = new Sparsely();

    testOptions.forEach(option => {
      parser.addOption(option);
    });

    const argv = [ '-A' ];
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
  });

  // This suite tests to ensure that
  // a single shorthand option that 
  // does not accept arguments is 
  // parsed correctly in shorthand form:
  describe('argv = ["-A"]', () => {
    const parser = new Sparsely();

    testOptions.forEach(option => {
      parser.addOption(option);
    });

    const argv = [ '-A' ];
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
  });

  // This suite tests to ensure that
  // multiple serparate verbose options
  // are parsed correctly:
  describe('argv = ["--option-A", "--option-F"]', () => {
    const parser = new Sparsely();
    testOptions.forEach(option => {
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
    testOptions.forEach(option => {
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

  // This suite tests to ensure that
  // a group of valid options is parsed
  // correctly:
  describe('argv = ["-AF"]', () => {
    const parser = new Sparsely();

    testOptions.forEach(option => {
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
  // a verbose option that accepts
  // an argument is parsed correctly:
  describe('argv = ["--option-B", "arg1"]', () => {
    const parser = new Sparsely();

    testOptions.forEach(option => {
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
  });

  // This suite tests to ensure that
  // a shorthand option that accepts
  // an argument is parsed correctly:
  describe('argv = ["-B", "arg1"]', () => {
    const parser = new Sparsely();

    testOptions.forEach(option => {
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
  });

  // This suite tests to ensure that
  // a verbose option that accepts
  // an argument is parsed correctly
  // when in key/value form:
  describe('argv = ["--option-C=arg"]', () => {
    const parser = new Sparsely();

    testOptions.forEach(option => {
      parser.addOption(option);
    });

    const argv = [ '--option-C=arg' ];
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
  });
  
  // This suite tests to ensure that
  // all types of arguments are parsed
  // correctly:
  describe('argv = ["-AF", "--option-B", "option-B-arg", "--option-C=arg", "program-arg-1", "program-arg-2", "-G", "option-G-arg-1", "option-G-arg-2", "-E", "-D"]', () => {
    const parser = new Sparsely();

    testOptions.forEach(option => {
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
  });
}); 