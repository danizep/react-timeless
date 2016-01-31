import React from 'react';
import ReactDOM from 'react-dom';

import Timeline from '../src/Timeline';

const dates = [
    {
        time: 601257600,
        label: 'things happened'
    },
    {
        time: 957139200,
        label: 'succeeded events'
    },
    {
        time: 601257600,
        label: 'things took place'
    },
    {
        time: 1217980800,
        label: 'yet another change of events'
    }

];

ReactDOM.render(
    <Timeline dates={dates} onChange={(data) => console.info(data)} />,
    document.getElementById('example')
);

