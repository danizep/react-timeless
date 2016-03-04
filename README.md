[![npm version](https://badge.fury.io/js/react-timeless.svg)](https://badge.fury.io/js/react-timeless)

#React-Timeless

A simple react timeline component for filtering data...

## Installation

You can install React-Timeless via NPM and integrate it in you build process (using the tools of your choice: [Webpack](https://webpack.github.io/), [Browserify](http://browserify.org), etc).

```
npm install react-timeless --save
```

## Usage

React-Timeless is still a work in progress component, but basically it creates a simple timeline with a rage based on the provided dates.

The timeline has two corsurs witch can be moved to define a selected range.

Every time the rage changes `onChange(newData)` will run.

```javascript
import Timeless from 'react-timeless';

const dates = [
    {
        start: 601257600,
        end: 957139200
    },
    {
        start: 957139200,
        end: 1217980800
    },
    {
        start: 601257600,
        end: 957139200
    },
    {
        start: 1217980800,
        end: 1219980800
    }

];

function logChange(data) {
	console.log("Min timestamp: " + data.minCursorTimestamp);
	console.log("Max timestamp: " + data.maxCursorTimestamp);
	console.log("Min year: " + data.minCursorDate);
	console.log("Max year: " + data.maxCursorDate);
}

<Timeless
	dates={dates}
	onChange={logChange}
/>
```

## Example

You can try it out here:
http://danizep.com/projects/react-timeless/examples/

## License

MIT Licensed. Copyright (c) danizep 2016.
