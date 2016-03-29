'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

import Timeless from '../src/Timeless';

const Main = React.createClass({
    getInitialState() {
        return {
            disabled: false
        }
    },

    render() {
        return (
            <div>
                <Timeless ref={(node) => { this.timeless = node}}
                          minTimestamp={601257600}
                          maxTimestamp={1217980800}
                          minCursorDefaultTimestamp={601257600}
                          maxCursorDefaultTimestamp={917980800}
                          onChangeDelay={250}
                          onChange={this._appendInfo}
                          disabled={this.state.disabled}
                    />
                <div className="example-controls">
                    <button type="button" onClick={this._toggleDisable}>disable</button>
                    <button type="button" onClick={this._reset}>reset</button>
                </div>
            </div>
        );
    },

    _toggleDisable() {
        const disabled = !this.state.disabled;

        this.setState({
            disabled
        })
    },

    _reset() {
        this.timeless.updateCursors({
            minCursorDefaultTimestamp: 601257600,
            maxCursorDefaultTimestamp: 917980800,
        });
    },

    _appendInfo(data) {
    console.info(data);
    document.getElementById('minT').innerHTML = data.minCursorTimestamp;
    document.getElementById('maxT').innerHTML = data.maxCursorTimestamp;
    document.getElementById('minY').innerHTML = data.minCursorDate;
    document.getElementById('maxY').innerHTML = data.maxCursorDate;
}
});

export default Main;