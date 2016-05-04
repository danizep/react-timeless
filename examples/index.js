import React from 'react';
import ReactDOM from 'react-dom';

import Timeless from '../src/Timeless';

require('../scss/default.scss');

ReactDOM.render(
    <Timeless minTimestamp={901257600}
              maxTimestamp={1217980800}
              minCursorDefaultTimestamp={901257600}
              maxCursorDefaultTimestamp={1217980800}
              onChangeDelay={250}
              onChange={appendInfo}
              customMinMessage="desde sempre"
        />,
    document.getElementById('example')
);

function appendInfo(data) {
    console.info(data);
    document.getElementById('minT').innerHTML = data.minCursorTimestamp;
    document.getElementById('maxT').innerHTML = data.maxCursorTimestamp;
    document.getElementById('minY').innerHTML = data.minCursorDate;
    document.getElementById('maxY').innerHTML = data.maxCursorDate;
}

