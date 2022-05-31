export interface ConfigOption {
  name: string,
  shorthand: string,
  acceptsArgs: boolean,
  keyValue: boolean,
  groupable: boolean,
  minArgs: number,
  maxArgs: number
}

export interface ParsedOption {
  name: string,
  args: string[]
}

export class Sparsely {
  private _options: ConfigOption[];
  private _parsedArgs: string[];
  private _parsedOptions: ParsedOption[];
  private _errors: string[];

  constructor() {
    this._options = [];
    this._parsedArgs = [];
    this._parsedOptions = [];
    this._errors = [];
  }

  /**
   * Returns all configured options.
   * 
   * @returns {ConfigOption[]} An array of all the configured options.
   */
  get options(): ConfigOption[] {
    return this._options;
  }

  /**
   * Returns all arguments parsed from the command line arguments
   * after exec is invoked.
   * 
   * @returns {string[]} An array of all the arguments parsed.
   */
   get parsedArgs() {
    return this._parsedArgs;
  }

  /**
   * Returns all options parsed from the command line arguments
   * after exec is invoked.
   * 
   * @returns {ParsedOption[]} An array of all the options parsed.
   */
  get parsedOptions() {
    return this._parsedOptions;
  }

  /**
   * Returns all error messages generated when exec is invoked.
   * 
   * @returns {string[]} An array of all the error messages.
   */
  get errors() {
    return this._errors;
  }

  /**
   * Adds a config option to the list of valid options.
   * 
   * @param {ConfigOption} option The config option to be added.
   */   
  addOption(option: ConfigOption) {
    if (this.isValidOption(option.name)) {
      throw new Error(`an option with the name '${option.name}' has already been registered`);
    }
    if (this.isValidOption(option.shorthand)) {
      throw new Error(`an option with the shorthand '${option.shorthand}' has already been registered`);
    }
    this._options.push(option);
  }

  /**
   * Returns true if the option with, 'name'
   * has been parsed.
   * 
   * @param {string} name the name of the option to check for
   * @returns {boolean}
   */
  isParsedOption(name: string): boolean {
    return this._parsedOptions.filter(option => option.name == name).length > 0;
  }

  /**
   * Returns true if 'argument' has been parsed.
   * 
   * @param {string} argument the argument to check for 
   * @returns {boolean}
   */
  isParsedArg(argument: string) {
    return this._parsedArgs.filter(arg => arg == argument).length > 0;
  }

  /**
   * Returns the parsed option with 'name' or null.
   * 
   * @param {string} name the name of the option
   * @returns { ParsedOption | null } the parsed option or null
   */
  getParsedOption(name: string): ParsedOption | null {
    const filtered = this._parsedOptions.filter(option => option.name == name);
    return filtered.length > 0 ? filtered[0] : null;
  }

  report() {
    // Print error messages:
    console.log('Errors:');
    this._errors.forEach(errorMessage => {
      console.log(`\t${errorMessage}`)
    });
    // Print parsed options:
    console.log('Options:');
    this._parsedOptions.forEach(option => {
      console.log(`\t${option.name}: ${option.args}`);
    });
    // Print parsed arguments:
    console.log('Arguments:');
    this._parsedArgs.forEach(arg => {
      console.log(`\t${arg}`);
    });
  }

  /**
   * Parses the command line arguments passed.
   * Ensure to not include 'node' or the name of
   * the main executable for your program.
   * 
   * E.g. use process.argv.slice(2)
   * 
   * @param {string[]} argv The command line arguments passed to the program.
   */
  exec(argv: string[]): void {
    this._parsedArgs = [];
    this._parsedOptions = [];
    this._errors = []
    
    const argvCount = argv.length;
    let currentArgIndex = 0;

    while (currentArgIndex < argvCount) {
      let currentArg = argv[currentArgIndex];

      if (!this.isOption(currentArg)) {
        // Current arg is not an option.
        // Add it to the list of parsed
        // arguments:
        this.addParsedArg(currentArg);
        currentArgIndex += 1;
        continue;
      }

      if (currentArg.match(/^-+$/)) {
        // Only hyphens have been provided.
        // Add an error accordingly:
        const message = `An empty option ('${currentArg}') has been provided.`;
        this.addError(message);
        currentArgIndex += 1;
        continue;
      }

      let name;

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
            this.addError(message);
            currentArgIndex += 1;
            continue;
          }

          name = this.getOptionKey(currentArg);

          if (!this.isValidOption(name)) {
            // Not a valid option - add error to 
            // the list of parsing errors:
            const message = `'${name}' is not a key/value option.`;
            this.addError(message);
          } else {
            // Valid option - add the option
            // to the parsed options list:
            this.addParsedOption(name, [this.getOptionValue(currentArg)]);
          }

          currentArgIndex += 1;
          continue;
        } else {
          name = currentArg.slice(2);
        }
      }

      if (!name) {
        // Option name has not been set yet.

        // The option is in shorthand form (may be a group of options):
        const optGroupString = currentArg.slice(1);
        const optGroupArray = optGroupString.split('');

        if (optGroupArray.length == 1) {
          // There is only one option,
          // so make sure it is valid:
          const option = optGroupArray[0];
          if (this.isValidOption(option)) {
            name = this.getOptionNameFromShorthand(option);
          } else {
            const message = `'${option}' is not a valid option.`;
            this.addError(message);
            currentArgIndex += 1;
            continue;
          }
        } else {
          // There are multiple options,
          // check all for validity:
          const validOptions: string[] = [];

          optGroupArray.forEach(opt => {
            if (this.isValidOption(opt)) {
              const optName = this.getOptionNameFromShorthand(opt);
              if (!optName) return;
              const configOpt = this.getOptionByName(optName);
              if (!configOpt) return;
              if (!configOpt.groupable) {
                const message = `'${opt} is not a groupable option.'`;
                this.addError(message);
              } else {
                validOptions.push(configOpt.name);
              }
            } else {
              const message = `'${opt}' is not a valid option.`;
              this.addError(message);
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
            name = this.getOptionNameFromShorthand(validOptions[0]);
          } else {
            // There are multiple options, so
            // none of them will accept arguments.
            // Add each to the parsed options list:
            validOptions.forEach(option => {
              const optName = this.getOptionNameFromShorthand(option);
              if (!optName) return;
              this.addParsedOption(optName);
            });
            currentArgIndex += 1;
            continue;
          }
        }
      }

      if (!name) {
        currentArgIndex += 1;
        continue;
      }
      
      if (!this.isValidOption(name)) {
        // The argument is an invalid option - add
        // a new error to the list and start analysing
        // the next argument:
        const message = `'${name}' is not a valid option.`;
        this.addError(message);
        currentArgIndex += 1;
        continue;
      }

      const configOpt = this.getOptionByName(name);

      if (!configOpt) {
        currentArgIndex += 1;
        continue;
      }

      if (!configOpt.acceptsArgs) {
        // The option does not accept arguments -
        // add the option to the list of parsed
        // options:
        this.addParsedOption(name);
        currentArgIndex += 1;
        continue;
      }

      // The option accepts arguments. Search the remaining
      // command line arguments for arguments for the option:

      const optionArguments = [];
      currentArgIndex += 1;

      while (argvCount >= currentArgIndex + 1) {
        
        const nextArg = argv[currentArgIndex];
        if (this.isOption(nextArg)) {
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
        const message = `'${name}' option requires a minimum of ${configOpt.minArgs} argument(s).`;
        this.addError(message);
        continue;
      }

      this.addParsedOption(name, optionArguments);
    }
  }

  /**
   * Returns true if the argument begins with
   * a hyphen (as options do):
   * 
   * @param {string} arg 
   * @returns {boolean}
   */
  private isOption(arg: string): boolean {
    return arg[0] === '-';
  }

  /**
   * Returns true if the argument begins with
   * two hyphens:
   * 
   * @param {string} arg 
   * @returns {boolean}
   */
  private isVerboseOption(arg: string): boolean {
    return arg[0] === '-' && arg[1] === '-';
  }

  /**
   * Returns true if the argument contains '=':
   * 
   * @param {string} arg 
   * @returns {boolean}
   */
  private isKeyValueOption(arg: string): boolean {
    return arg.includes('=');
  }

  /**
   * Returns the key from a key/value option:
   * 
   * @param {string} arg 
   * @returns {string} the key of the key/value option
   */
  private getOptionKey(arg: string): string {
    // Remove leading hyphens:
    const strippedArg = arg.slice(2);
    return strippedArg.slice(0, strippedArg.indexOf('='));
  }

  /**
   * Returns the value from a key/value option:
   * 
   * @param {string} arg 
   * @returns {string} the value of the key/value option
   */
  private getOptionValue(arg: string): string {
    return arg.slice(arg.indexOf('=') + 1);
  }

  /**
   * Returns true if opt is in the list of 
   * valid options:
   * 
   * @param {string} opt the option - in verbose or shorthand form
   * @returns {boolean}
   */
  private isValidOption(opt: string): boolean {
    return this._options.filter(option => option.name === opt || option.shorthand == opt).length > 0;
  }

  /**
   * Returns if shorthand matches the shorthand property
   * of a registered option it returns the name of that 
   * option, or null if not: 
   * 
   * @param {string} shorthand the shorthand for the option
   * @returns { string | null } the name of the option or null
   */
  private getOptionNameFromShorthand(shorthand: string): string | null {
    const matchingOptions = this._options.filter(option => option.shorthand === shorthand);
    return matchingOptions.length > 0 ? matchingOptions[0].name : null;
  }

  /**
   * Returns the registered option with 'name',
   * or null:
   * 
   * @param {string} name the name of the option to get
   * @returns { ConfigOption | null } the configured option or null
   */
  private getOptionByName(name: string): ConfigOption | null {
    const matchingOptions = this._options.filter(option => option.name === name);
    return matchingOptions.length > 0 ? matchingOptions[0] : null;
  }

  /**
   * Adds errorMessage to the errors array:
   * 
   * @param {string} errorMessage the error message to be added
   */
  private addError(errorMessage: string): void {
    this._errors.push(errorMessage);
  }

  /**
   * Adds option info to the parsedOptions array:
   * 
   * @param {string} name the name of the option to be added
   * @param {string[]} args the arguments supplied for the option
   */
  private addParsedOption(name: string, args: string[] = []): void {
    this._parsedOptions.push({ name, args });
  }

  /**
   * Adds a parsed program argument to parsedArgs:
   * 
   * @param {string} arg the argument to be added
   */
  private addParsedArg(arg: string): void {
    this._parsedArgs.push(arg);
  }
}