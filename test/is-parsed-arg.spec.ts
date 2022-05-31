import { expect } from 'chai';
import { Sparsely, ConfigOption } from '../lib';
import testOptions from './test-options';

// This suite tests to ensure that
// the isParsedArg method indicates
// whether an argument has been parsed
// or not:
describe('argv = ["arg1"]', () => {
  const parser = new Sparsely();

  testOptions.forEach((option: ConfigOption) => {
    parser.addOption(option);
  });

  const argv = [ 'arg1' ];
  parser.exec(argv);

  describe('isParsedArg', () => {
    it('should return true with an argument of "arg1"', () => {
      const result = parser.isParsedArg('arg1');
      expect(result).to.be.true;
    });

    it('should return false with an argument of "arg2"', () => {
      const result = parser.isParsedArg('arg2');
      expect(result).to.be.false;
    });
  });
});