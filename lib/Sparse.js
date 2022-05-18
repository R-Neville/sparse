class Sparse {
  #options;
  #parsedArgs;
  #parsedOptions;
  #errors;

  constructor() {
    this.#options = [];
    this.#parsedArgs = [];
    this.#parsedOptions = [];
    this.#errors = [];
  }

  /**
   * Returns all configured options.
   * 
   * @returns {Array<ConfigOption>} An array of all the configured options.
   */
  get options() {
    return this.#options;
  }

  /**
   * Returns all arguments parsed from the command line arguments
   * after exec is invoked.
   * 
   * @returns {Array<string>} An array of all the arguments parsed.
   */
   get parsedArgs() {
    return this.#parsedArgs;
  }

  /**
   * Returns all options parsed from the command line arguments
   * after exec is invoked.
   * 
   * @returns {Array<ParsedOption>} An array of all the options parsed.
   */
  get parsedOptions() {
    return this.#parsedOptions;
  }

  /**
   * Returns all error messages generated when exec is invoked.
   * 
   * @returns {Array<string>} An array of all the error messages.
   */
  get errors() {
    return this.#errors;
  }

  /**
   * Adds a config option to the list of valid options.
   * 
   * @param {ConfigOption} option The config option to be added.
   * @param {string} option.name The full name/form of the command line option.
   * @param {string} option.shorthand The shorthand form for the command line option.
   * @param {boolean} option.acceptsArgs Does the option accept arguments?
   * @param {boolean} option.keyValue Can the option appear in key/value form?
   * @param {boolean} option.groupable Can the option be grouped with other options?
   * @param {number} option.minArgs The minimum number of arguments that the option accepts.
   * @param {number} option.maxArgs The maximum number of arguments that the option accepts.
   */   
  addOption(option) {
    this.#options.push(option);
  }

  report() {
    console.log(`Errors: ${this.#errors}`);
    this.#parsedOptions.forEach(option => {
      console.log(`${option.name}: ${option.args}`);
    });
    console.log(`Arguments: ${this.#parsedArgs}`);
  }

  /**
   * Parses the command line arguments passed.
   * Ensure to not include 'node' or the name of
   * the main executable for your program.
   * 
   * E.g. use process.argv.slice(2)
   * 
   * @param {Array<string>} argv The command line arguments passed to the program.
   */
  exec(argv) {
    const argvCount = argv.length;
    let currentArgIndex = 0;

    while (currentArgIndex < argvCount) {
      let currentArg = argv[currentArgIndex];

      if (!this.#isOption(currentArg)) {
        // Current arg is not an option.
        // Add it to the list of parsed
        // arguments:
        this.#parsedArgs.push(currentArg);
        currentArgIndex += 1;
        continue;
      }

      if (currentArg.match(/^-+$/)) {
        // Only hyphens have been provided.
        // Add an error accordingly:
        const message = `An empty option ('${currentArg}') has been provided.`;
        this.#errors.push(message);
        currentArgIndex += 1;
        continue;
      }

      const parsedOpt = {};

      if (this.#isVerboseOption(currentArg)) {
        // Current arg is a verbose option - 
        // it is prefixed with 2 hyphens.

        if (this.#isKeyValueOption(currentArg)) {
          // The option is in the form of a 
          // key/value pair.

          if (currentArg.split('=').length > 2) {
            // There are too many equals signs.
            // Invalid key/value pair.
            const message = `Invalid key/value option '${currentArg}'.`;
            this.#errors.push(message);
            currentArgIndex += 1;
            continue;
          }

          parsedOpt.name = this.#getOptionKey(currentArg);

          if (!this.#isValidOption(parsedOpt.name)) {
            // Not a valid option - add error to 
            // the list of parsing errors:
            const message = `'${parsedOpt.name}' is not a key/value option.`;
            this.#errors.push(message);
          } else {
            // Valid option - add the option
            // to the parsed options list:
            parsedOpt.value = this.#getOptionValue(currentArg);
            this.#parsedOptions.push(parsedOpt);
          }

          currentArgIndex += 1;
          continue;
        } else {
          parsedOpt.name = currentArg.slice(2);
        }
      }

      if (!parsedOpt.name) {
        // Option name has not been set yet.

        // The option is in shorthand form (may be a group of options):
        const optGroupString = currentArg.slice(1);
        const optGroupArray = this.#splitOptionGroup(optGroupString);
        const validOptions = [];

        optGroupArray.forEach(opt => {
          if (this.#isValidOption(opt)) {
            validOptions.push(opt);
          } else {
            const message = `'${opt}' is not a valid option.`;
            this.#errors.push(message);
          }
        });

        if (validOptions.length === 0) {
          // There are no valid options in the current
          // argument. Move on to the next argument:
          currentArgIndex += 1;
          continue;
        } else if (validOptions.length === 1) {
          // There is only one option -
          // it might accept arguments:
          parsedOpt.name = this.#getOptionNameFromShorthand(validOptions[0]);
        } else {
          // There are multiple options, so
          // none of them will accept arguments.
          // Add each to the parsed options list:
          validOptions.forEach(option => {
            this.#parsedOptions.push({
              name: this.#getOptionNameFromShorthand(option)
            });
          });
          currentArgIndex += 1;
          continue;
        }
      }
      
      if (!this.#isValidOption(parsedOpt.name)) {
        // The argument is an invalid option - add
        // a new error to the list and start analysing
        // the next argument:
        const message = `'${parsedOpt.name}' is not a valid option.`;
        this.#errors.push(message);
        currentArgIndex += 1;
        continue;
      }

      const configOpt = this.#getOptionByName(parsedOpt.name);

      if (!configOpt.acceptsArgs) {
        // The option does not accept arguments -
        // add the option to the list of parsed
        // options:
        this.#parsedOptions.push(parsedOpt);
        currentArgIndex += 1;
        continue;
      }

      // The option accepts arguments. Search the remaining
      // command line arguments for arguments for the option:

      const optionArguments = [];
      currentArgIndex += 1;

      while (argvCount >= currentArgIndex + 1) {
        
        const nextArg = argv[currentArgIndex];
        if (this.#isOption(nextArg)) {
          // Found the next option. Cease
          // searching for arguments:
          break;
        } else {
          optionArguments.push(nextArg);
        }

        currentArgIndex += 1
        
        if (optionArguments.length === configOpt.maxArgs) {
          break;
        }
      }
      
      if (optionArguments.length < configOpt.minArgs) {
        const message = `'${parsedOpt.name}' option requires a minimum of ${configOpt.minArgs} argument(s).`;
        this.#errors.push(message);
        continue;
      }

      parsedOpt.args = optionArguments;

      this.#parsedOptions.push(parsedOpt);
    }
  }

  #isOption(arg) {
    return arg[0] === '-';
  }

  #isVerboseOption(arg) {
    return arg[0] === '-' && arg[1] === '-';
  }

  #isKeyValueOption(arg) {
    return arg.includes('=');
  }

  #getOptionKey(arg) {
    // Remove leading hyphens:
    const strippedArg = arg.slice(2);
    return strippedArg.slice(0, strippedArg.indexOf('='));
  }

  #getOptionValue(arg) {
    return arg.slice(arg.indexOf('=') + 1);
  }

  #splitOptionGroup(optGroupString) {
    return optGroupString.split('');
  }

  #isValidOption(name) {
    return this.#options.filter(option => option.name === name || option.shorthand == name).length > 0;
  }

  #getOptionNameFromShorthand(shorthand) {
    const matchingOptions = this.#options.filter(option => option.shorthand === shorthand);
    return matchingOptions.length > 0 ? matchingOptions[0].name : null;
  }

  #getOptionByName(name) {
    const matchingOptions = this.#options.filter(option => option.name === name);
    return matchingOptions.length > 0 ? matchingOptions[0] : null;
  }
}

module.exports = Sparse;