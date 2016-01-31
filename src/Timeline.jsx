import React from 'react';
import ReactDOM from 'react-dom';

const Timeline = React.createClass({
    getInitialState() {
        return {
            minCursorX: 0,
            maxCursorX: 0,
            minCursorDate: this.props.minTime,
            maxCursorDate: this.props.minTime
        }
    },

    getDefaultProps() {
        return {
            dates: {},
            onChange: null,
            onChangeDelay: 250,
            minTime: 1996,
            maxTime: 2015
        }
    },

    componentWillMount() {
        this._getMinMaxDates();
        this._addListeners();
    },

    componentWillUnmount() {
        this._removeListeners();
    },

    componentDidMount() {
        this._setWindowVars();
    },

    render() {
        const {minTime, maxTime} = this.state;

        const minCursorStyle = {
            transform: `translateX(${this.state.minCursorX}px)`
        };

        const maxCursorStyle = {
            transform: `translateX(${this.state.maxCursorX}px)`
        };

        return (
            <div className="timeline-wrapper" ref={(ref) => this.timelineWrapper = ref}>
                <div className="timeline-available">
                    {this._getAvailableYearsHtml(this.props.minTime, this.props.maxTime)}
                </div>
                <div className="timeline-range">
                    <div className="time-cursor time-cursor--min"
                         ref={(ref) => this.minCursor = ref}
                         style={minCursorStyle}
                         onMouseDown={this._handleMouseDown.bind(this, 'min')}
                        >{this.state.minCursorDate}
                    </div>
                    <div className="time-cursor time-cursor--max"
                         ref={(ref) => this.maxCursor = ref}
                         style={maxCursorStyle}
                         onMouseDown={this._handleMouseDown.bind(this, 'max')}
                        >{this.state.maxCursorDate}</div>
                </div>
            </div>
        );
    },

    _handdleDrag(event) {
        let state = {};

        const index = this.state.activeCursor;
        const cursorSize = 100;
        let translateValue = event.clientX - (this.maxCursor.offsetLeft);

        if ( translateValue > this.state.wrapperSize - cursorSize ) translateValue = this.state.wrapperSize - cursorSize;

        state[`${index}CursorX`] = translateValue;

        this.setState(state, () => {
            this._updateValue();
        });

    },

    _handleChange() {
        if (this.props.onChange !== null && typeof this.props.onChange === 'function') {
            
            this.props.onChange()
        }
    },

    _getMinMaxDates() {
        const dates = this.props.dates;
        let minTime;
        let maxTime;

        if(dates) {
            minTime = dates[0].time;
            maxTime = dates[0].time;

            for(let date of dates) {
                if(date.time < minTime) minTime = date.time;
                if(date.time > maxTime) maxTime = date.time;
            }

            this.setState({minTime, maxTime})
        }
    },

    _getAvailableYearsHtml(min, max) {
        let html = [];

        min--;
        max++;

        for(min; min <= max; min++) {
            html.push(<div className="time-block" key={`year-${min}`} >{min}</div>)
        }

        return html;
    },

    _handleMouseUp()
    {
        window.removeEventListener('mousemove', this._handdleDrag, true);
    },

    _handleMouseDown(cursor){
        this.setState(
            {
                activeCursor: cursor
            }, () => {
                window.addEventListener('mousemove', this._handdleDrag, true);
            }
        )
    },

    _handleResize() {
        this._setWindowVars();
    },

    _addListeners() {
        window.addEventListener('mouseup', this._handleMouseUp, false);
        window.addEventListener('resize', this._handleResize, false);
    },

    _removeListeners() {
        window.removeEventListener('mouseup', this._handleMouseUp, false);
        window.removeEventListener('resize', this._handleResize, false);
    },

    _setWindowVars() {
        const time = this.props.maxTime - this.props.minTime;
        const wrapperSize = this.timelineWrapper.offsetWidth;
        const timeScale = wrapperSize / time;

        console.log(wrapperSize);

        this.setState(
            {
                wrapperSize,
                timeScale
            }
        )
    },

    _updateValue() {
        const minCursorDate = this.props.minTime + parseInt(this.state.minCursorX / this.state.timeScale);
        const maxCursorDate = this.props.minTime + parseInt(this.state.maxCursorX / this.state.timeScale);

        this.setState(
            {   minCursorDate,
                maxCursorDate
            },
            () => {
                this._handleChange()
            }
        );
    }
});

export default Timeline;

