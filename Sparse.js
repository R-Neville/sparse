class ArgParser {
  constructor() {
    this._options = [];
    this._parsedArgs = [];
    this._parsedOptions = [];
    this._errors = [];
  }

  get parsedOptions() {
    return this._parsedOptions;
  }

  get parsedArgs() {
    return this._parsedArgs;
  }

  get errors() {
    return this._errors;
  }

  // Adds option to the list of accepted options.
  // Parameters:
  // option -> An object with the following properties:
  //        -> name
  //        -> shorthand
  //        -> acceptsArgs
  //        -> keyValue
  //        -> groupable
  //        -> minArgs
  //        -> maxArgs      
  addOption(option) {
    this._options.push(option);
  }

  exec(argv) {
    const argvCount = argv.length;
    let currentArgIndex = 0;

    while (currentArgIndex < argvCount) {
      let currentArg = argv[currentArgIndex];

      if (!this.isOption(currentArg)) {
        // Current arg is not an option.
        // Add it to the list of parsed
        // arguments:
        this._parsedArgs.push(currentArg);
        currentArgIndex += 1;
        continue;
      }

      if (currentArg.match(/^-+$/)) {
        // Only hyphens have been provided.
        // Add an error accordingly:
        const message = `An empty option ('${currentArg}') has been provided.`;
        this._errors.push(message);
        currentArgIndex += 1;
        continue;
      }

      const parsedOpt = {};

      if (this.isVerboseOption(currentArg)) {
        // Current arg is a verbose option - 
        // it is prefixed with 2 hyphens.

        if (this.isKeyValueOption(currentArg)) {
          // The option is in the form of a 
          // key/value pair.

          if (currentArg.split('=').length > 2) {
            // There are too many equals signs.
            // Invalid key/value pair.
            const message = `Invalid key/value option '${currentArg}'.`;
            this._errors.push(message);
            currentArgIndex += 1;
            continue;
          }

          parsedOpt.name = this.getOptionKey(currentArg);

          if (!this.isValidOption(parsedOpt.name)) {
            // Not a valid option - add error to 
            // the list of parsing errors:
            const message = `'${parsedOpt.name}' is not a key/value option.`;
            this._errors.push(message);
          } else {
            // Valid option - add the option
            // to the parsed options list:
            parsedOpt.keyValue = true;
            parsedOpt.value = this.getOptionValue(currentArg);
            this._parsedOptions.push(parsedOpt);
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
        const optGroupArray = this.splitOptionGroup(optGroupString);
        const validOptions = [];

        optGroupArray.forEach(opt => {
          if (this.isValidOption(opt)) {
            validOptions.push(opt);
          } else {
            const message = `'${opt}' is not a valid option.`;
            this._errors.push(message);
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
          parsedOpt.name = this.getOptionNameFromShorthand(validOptions[0]);
        } else {
          // There are multiple options, so
          // none of them will accept arguments.
          // Add each to the parsed options list:
          validOptions.forEach(option => {
            this._parsedOptions.push({
              name: this.getOptionNameFromShorthand(option)
            });
          });
          currentArgIndex += 1;
          continue;
        }
      }
      
      if (!this.isValidOption(parsedOpt.name)) {
        // The argument is an invalid option - add
        // a new error to the list and start analysing
        // the next argument:
        const message = `'${parsedOpt.name}' is not a valid option.`;
        this._errors.push(message);
        currentArgIndex += 1;
        continue;
      }

      const configOpt = this.getOptionByName(parsedOpt.name);

      if (!configOpt.acceptsArgs) {
        // The option does not accept arguments -
        // add the option to the list of parsed
        // options:
        this._parsedOptions.push(parsedOpt);
        currentArgIndex += 1;
        continue;
      }

      // The option accepts arguments. Search the remaining
      // command line arguments for arguments for the option:

      const argumentsRemaining = argvCount - currentArgIndex + 1;
      const optionArguments = [];
      while (currentArgIndex < argumentsRemaining) {

        currentArgIndex += 1;
        
        const nextArg = argv[currentArgIndex];
        if (this.isOption(nextArg)) {
          // Found the next option. Cease
          // searching for arguments:
          break;
        } else {
          optionArguments.push(nextArg);
        }
        
        if (optionArguments.length === configOpt.maxArgs) {
          break;
        }
      }
      
      if (optionArguments.length < configOpt.minArgs) {
        const message = `'${parsedOpt.name}' option requires a minimum of ${configOpt.minArgs} argument(s).`;
        this._errors.push(message);
        continue;
      }

      parsedOpt.args = optionArguments;

      this._parsedOptions.push(parsedOpt);
    }
  }

  isOption(arg) {
    return arg[0] === '-';
  }

  isVerboseOption(arg) {
    return arg[0] === '-' && arg[1] === '-';
  }

  isKeyValueOption(arg) {
    return arg.includes('=');
  }

  getOptionKey(arg) {
    // Remove leading hyphens:
    const strippedArg = arg.slice(2);
    return strippedArg.slice(0, strippedArg.indexOf('='));
  }

  getOptionValue(arg) {
    return arg.slice(arg.indexOf('=') + 1);
  }

  splitOptionGroup(optGroupString) {
    return optGroupString.split('');
  }

  isValidOption(name) {
    return this._options.filter(option => option.name === name || option.shorthand == name).length > 0;
  }

  getOptionNameFromShorthand(shorthand) {
    const matchingOptions = this._options.filter(option => option.shorthand === shorthand);
    return matchingOptions.length > 0 ? matchingOptions[0].name : null;
  }

  getOptionByName(name) {
    const matchingOptions = this._options.filter(option => option.name === name);
    return matchingOptions.length > 0 ? matchingOptions[0] : null;
  }
}

module.exports = ArgParser;