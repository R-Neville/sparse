const { expect } = require('chai');
const Sparse = require('../lib/Sparse');

describe('Sparse', () => {

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