import React from 'react';
import ReactDOM from 'react-dom';

import Timeline from '../src/Timeline';

const dates = [
    {
        start: 601257600,
        end: 601257600
    },
    {
        start: 957139200,
        end: 957139200
    },
    {
        start: 601257600,
        end: 601257600
    },
    {
        start: 1217980800,
        end: 1217980800
    }

];

ReactDOM.render(
    <Timeline dates={dates} onChange={(data) => appendInfo(data)} />,
    document.getElementById('example')
);

function appendInfo(data) {
    console.info(data);
    document.getElementById('minT').innerHTML = data.minCursorTimestamp;
    document.getElementById('maxT').innerHTML = data.maxCursorTimestamp;
    document.getElementById('minY').innerHTML = data.minCursorDate;
    document.getElementById('maxY').innerHTML = data.maxCursorDate;
}

