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
  name: 'help',
  shorthand: 'h',
  acceptsArgs: false,
  keyValue: false,
  groupable: false,
  minArgs: 0,
  maxArgs: 0
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
// passed to exec:
parser.exec(process.argv.slice(2));
```

`Sparsely` objects have three important properties, which you 
can use to determine the parsing results:

- `errors` -> an array of error messages.
- `parsedArgs` -> an array of all *program* arguments.
- `parsedOptions` -> an array of all options (each option 
is represented as an object with a `name` and `args` (string array) property).
