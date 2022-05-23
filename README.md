# Sparsely

A command line argument parser for JavaScript. 

## Usage

To install Sparsely, run:

```
npm install sparsely
```

Sparsely consists of a single class (`Sparsely`), which can be imported
into your project by running:

```js
const Sparsely = require('sparsely');
```

You can use the `addOption` method to register options with an
instance:

```js
const parser = new Sparsely();

parser.addOption({
  name: 'help', // The verbose form of the option (--help)
  shorthand: 'h', // The shorthand form of the option (-h)
  acceptsArgs: false, // Does the option accept arguments?
  keyValue: false, // Can the option appear in key/value form?
  groupable: false, // Can the option appear in a group?
  minArgs: 0, // Min arguments required for the option
  maxArgs: 0 // Max arguments required for the option
});
```

All of the properties specified in the example above
are required for correct execution of the `exec` method -
the primary parsing logic. `exec` takes an string array (of 
command line arguments) as its sole argument:

```js
// Remember to NOT include 'node'
// and the entry point to your 
// app (index.js) in the array
// passed to exec (they will be
// parsed):
parser.exec(process.argv.slice(2));
```

`Sparsely` objects have three important properties, which you 
can use to determine the parsing results:

- `errors` -> an array of error messages.
- `parsedArgs` -> an array of all *program* arguments.
- `parsedOptions` -> an array of all options (each option 
is represented as an object with a `name` and `args` (string array) property).

The following methods can be used to assist in processing
Sparsely's results after `exec` has been invoked:

- `isParsedOption`
  - Takes the name of an option as its argument
  - Returns `true` if the option has been parsed
- `getParsedOption`
  - Takes the name of an option as its argument
  - Returns the parsed option if found
- `isParsedArg`
  - Takes the (string) argument
  - Returns `true` if the argument has been parsed

For example:

```js
const Sparsely = require('sparsely');

const parser = new Sparsely();

parser.addOption({
  name: 'verbose',
  shorthand: 'v',
  acceptsArgs: false,
  keyValue: false,
  groupable: true,
  minArgs: 0,
  maxArgs: 0
});

parser.addOption({
  name: 'port',
  shorthand: 'p',
  acceptsArgs: true,
  keyValue: true,
  groupable: false,
  minArgs: 1,
  maxArgs: 1
});

parser.exec([ '-v', '--port=8080', 'arg1' ]);

console.log(parser.isParsedOption('help')); // -> false
console.log(parser.isParsedOption('port')); // -> true
console.log(parser.isParsedArg('arg2')); // -> false
console.log(parser.isParsedArg('arg1')); // -> true

console.log(parser.errors); // -> []
console.log(parser.parsedArgs); // -> ['arg1']
console.log(parser.parsedOptions); // -> [ { name: 'verbose', args: [] }, { name: 'port', args: [ '8080' ] } ]
console.log(parser.getParsedOption('port')); // { name: 'port', args: [ '8080' ] }

```
