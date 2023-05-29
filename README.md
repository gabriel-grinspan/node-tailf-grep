# About
The goal of this package is to imitate tail -F | grep functionality in node.

This is the simplest way to tail a file, filter the output, and run a function. The program will continue to tail the file until the process is killed. It will also continue to tail the file even if the file is deleted and recreated.

## Basic Usage
The below code will tail the file `/var/log/my-app.log` and print the contents of each change to the console.

```js
const Tail = require('tailf-grep');
const fn = changes => { console.log(changes); };
const tail = new Tail('/var/log/my-app.log', fn);
```

## Advanced Usage
The below code will tail the file `/var/log/my-app.log` and print the contents of each change to the console provided that the change contains a string in the array.

```js
const Tail = require('tailf-grep');
const fn = changes => { console.error(changes); };
const tail = new Tail('/var/log/my-app.log', ['ERROR', 'WARNING'], fn);
```

## Excluding Text
You can also tell the tailer to ignore certain text in another array. The below code will tail the file `/var/log/my-app.log` and print the contents of each change to the console provided that the change does not contain a string in the array.

```js
const Tail = require('tailf-grep');
const fn = changes => { console.error(changes); };
const tail = new Tail('/var/log/my-app.log', ['ERROR', 'WARNING'], ['exclude me', 'definitely don\'t report me'], fn);
```
