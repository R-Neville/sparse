# Sparsely

A command line argument parser for JavaScript and TypeScript. 

## Installation

```
npm install sparsely
```

## Overview

Sparsely exports one class (`Sparsely`) and two interfaces for 
TypeScript usage - `ConfigOption` and `ParsedOption`. The 
`Sparsely` class instantiates an argument parser, and options
that your application accepts can be registered with `Sparsely`
objects by invoking the `addOption` method with an argument that
follows the `ConfigOption` interface declaration:

```ts
interface ConfigOption {
  name: string, // The verbose form of the option ('--help')
  shorthand: string, // The shorthand form of the option ('-h')
  acceptsArgs: boolean, // Does the option accept arguments?
  keyValue: boolean, // Can the option appear in key/value pair form?
  groupable: boolean, // Is the option groupable with other options?
  minArgs: number, // The minimum number of arguments the option accepts
  maxArgs: number // The maximum number of arguments the option accepts
}
```

Command line arguments are parsed by `Sparsely` objects' `exec` method.
This method, analyses a single string array arugment and populates three
properties with results:

- `errors` - a string array containing error messages (if invalid options
were passsed to your application, etc.).
- `parsedArgs` - a string array containing any **program arguments**.
- `parsedOptions` - an array of objects following the `ParsedOption`
interface declaration:

```ts
interface ParsedOption {
  name: string, // The verbose form of the option
  args: string[] // The arguments that were parsed for the option
}
```

### Helper Methods

The following methods can be used to assist in processing the results
produced by `exec`:

- `isParsedOption`
  - Takes the name of an option as its argument
  - Returns `true` if the option has been parsed
- `getParsedOption`
  - Takes the name of an option as its argument
  - Returns the parsed option if found
- `isParsedArg`
  - Takes the (string) argument
  - Returns `true` if the argument has been parsed

## Including Sparsely in your code

```ts
// TypeScript
import { Sparsely, ConfigOption, ParsedOption } from 'sparsely';
```

```js
// JavaScript
const { Sparsely } = require('sparsely');
```

## Usage

It convenient to create a separate file containing all valid options
for your application (as an array of `ConfigOption` objects):

```ts
// valid-options.ts

export default [
  {
    name: "option-A",
    shorthand: "A",
    acceptsArgs: false,
    keyValue: false,
    groupable: false,
    minArgs: 0,
    maxArgs: 0
  },
  {
    name: "option-B",
    shorthand: "B",
    acceptsArgs: true,
    keyValue: false,
    groupable: false,
    minArgs: 1,
    maxArgs: 1
  },
  {
    name: "option-C",
    shorthand: "C",
    acceptsArgs: true,
    keyValue: true,
    groupable: false,
    minArgs: 1,
    maxArgs: 1
  },
  {
    name: "option-D",
    shorthand: "D",
    acceptsArgs: false,
    keyValue: false,
    groupable: true,
    minArgs: 0,
    maxArgs: 0
  },
  {
    name: "option-E",
    shorthand: "E",
    acceptsArgs: false,
    keyValue: false,
    groupable: true,
    minArgs: 0,
    maxArgs: 0
  },
  {
    name: "option-F",
    shorthand: "F",
    acceptsArgs: false,
    keyValue: false,
    groupable: false,
    minArgs: 0,
    maxArgs: 0
  },
  {
    name: "option-G",
    shorthand: "G",
    acceptsArgs: true,
    keyValue: false,
    groupable: false,
    minArgs: 1,
    maxArgs: 3
  }
]
```

You can then import these objects into the file where you create
your parser object and add them through iteration:

```ts
// parser.ts

import { Sparsely, ConfigOption } from 'sparsely';
import validOptions from './valid-options';

const parser = new Sparsely();

validOptions.forEach((option: ConfigOption) => {
  parser.addOption(option);
});

export default parser;

```

Import the parser object into your app's entry point 
(or wherever you want...):

```ts
// main.ts

import parser from './parser';

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

console.log(parser.errors);
console.log(parser.parsedOptions);
console.log(parser.parsedArgs);

```

This example produces the following output:

```
[]
[
  { name: 'option-E', args: [] },
  { name: 'option-D', args: [] },
  { name: 'option-B', args: [ 'option-B-arg' ] },
  { name: 'option-C', args: [ 'arg' ] },
  { name: 'option-G', args: [ 'option-G-arg-1' ] },
  { name: 'option-A', args: [] },
  { name: 'option-F', args: [] }
]
[ 'program-arg-1', 'program-arg-2' ]

```

