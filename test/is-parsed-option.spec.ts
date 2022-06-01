import { expect } from 'chai';
import { Sparsely, ConfigOption } from '../lib';
import testOptions from './test-options';

// This suite tests to ensure that
// the isParsedOption method indicates
// whether an option has been parsed
// or not:
describe('argv = ["-A", "-B"]', () => {
  const parser = new Sparsely();

  testOptions.forEach((option: ConfigOption) => {
    parser.addOption(option);
  });

  const argv = [ '-A', '-B' ];
  parser.exec(argv);

  describe('isParsedOption', () => {
    it('should return true with an argument of "option-A"', () => {
      const result = parser.isParsedOption('option-A');
      expect(result).to.be.true;
    });

    it('should return false with an argument of "option-B"', () => {
      const result = parser.isParsedOption('option-B');
      expect(result).to.be.false;
    });
  });
});