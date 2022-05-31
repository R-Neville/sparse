import { expect } from 'chai';
import { Sparsely, ConfigOption } from '../lib';
import testOptions from './test-options';

// This suite simply tests that options
// are added correctly via the addOption
// method:
describe('options', () => {
  const parser = new Sparsely();

  testOptions.forEach((option: ConfigOption )=> {
    parser.addOption(option);
  });

  it(`should return an array of length ${testOptions.length}`, () => {
    const options = parser.options;
    expect(options).to.have.lengthOf(options.length);
  });
});