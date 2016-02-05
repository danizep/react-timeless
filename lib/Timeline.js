'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _fastclick = require('fastclick');

var _fastclick2 = _interopRequireDefault(_fastclick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Timeline = _react2.default.createClass({
    displayName: 'Timeline',
    getInitialState: function getInitialState() {
        return {
            minCursorX: 0,
            maxCursorX: 0,
            minCursorDate: 0,
            maxCursorDate: 0
        };
    },
    getDefaultProps: function getDefaultProps() {
        return {
            dates: {},
            onChange: null,
            onChangeDelay: 250,
            cursorSize: 75,
            cursorSnap: false,
            timeRangeDrag: false
        };
    },
    componentWillMount: function componentWillMount() {
        this._getMinMaxDates();
        this._addListeners();
    },
    componentWillUnmount: function componentWillUnmount() {
        this._removeListeners();
    },
    componentDidMount: function componentDidMount() {
        this._setFastClick();
        this._setWindowVars();
    },
    render: function render() {
        var _this = this;

        var minCursorStyle = {
            transform: 'translateX(' + this.state.minCursorX + 'px)',
            width: this.props.cursorSize
        };

        var maxCursorStyle = {
            transform: 'translateX(' + this.state.maxCursorX + 'px)',
            width: this.props.cursorSize
        };

        var timeRangeStyle = {
            transform: 'translateX(' + this.state.minCursorX + 'px)',
            width: this.state.maxCursorX - this.state.minCursorX + this.props.cursorSize
        };

        if (this.state.animate) {
            minCursorStyle.transition = maxCursorStyle.transition = timeRangeStyle.transition = 'all 0.25s ease';
        }

        return _react2.default.createElement(
            'div',
            { className: 'timeline-wrapper', ref: function ref(_ref3) {
                    return _this.timelineWrapper = _ref3;
                } },
            _react2.default.createElement(
                'div',
                { className: 'timeline-available' },
                this._getAvailableYearsHtml(this.state.minTime, this.state.maxTime)
            ),
            _react2.default.createElement('div', { className: 'timeline-range', style: timeRangeStyle }),
            _react2.default.createElement(
                'div',
                { className: 'time-cursor time-cursor--min',
                    ref: function ref(_ref) {
                        return _this.minCursor = _ref;
                    },
                    style: minCursorStyle,
                    onMouseDown: this._handleMouseDown.bind(this, 'min'),
                    onTouchStart: this._handleMouseDown.bind(this, 'min')
                },
                this.state.minCursorDate
            ),
            _react2.default.createElement(
                'div',
                { className: 'time-cursor time-cursor--max',
                    ref: function ref(_ref2) {
                        return _this.maxCursor = _ref2;
                    },
                    style: maxCursorStyle,
                    onMouseDown: this._handleMouseDown.bind(this, 'max'),
                    onTouchStart: this._handleMouseDown.bind(this, 'max')
                },
                this.state.maxCursorDate
            )
        );
    },
    _handdleDrag: function _handdleDrag(event) {
        var _this2 = this;

        var state = {};

        var index = this.state.activeCursor;
        var cursorSize = this.props.cursorSize;
        var translateValue = event.clientX - this.state.activeCursorOffsetClient;

        if (index === 'max') {
            if (translateValue > this.state.wrapperSize - cursorSize) translateValue = this.state.wrapperSize - cursorSize;
            if (translateValue < this.state.minCursorX + this.props.cursorSize) translateValue = this.state.minCursorX + this.props.cursorSize;
        }

        if (index === 'min') {
            if (translateValue < 0) translateValue = 0;
            if (translateValue > this.state.maxCursorX - this.props.cursorSize) translateValue = this.state.maxCursorX - this.props.cursorSize;
        }

        state[index + 'CursorX'] = translateValue;

        this.setState(state, function () {
            _this2._updateValue();
        });
    },
    _handleChange: function _handleChange() {
        if (this.props.onChange !== null && typeof this.props.onChange === 'function') {
            this.props.onChange(this.state);
        }
    },
    _getMinMaxDates: function _getMinMaxDates() {
        var dates = this.props.dates;
        var minTime = undefined;
        var maxTime = undefined;

        if (dates) {
            minTime = dates[0].time;
            maxTime = dates[0].time;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = dates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var date = _step.value;

                    if (date.time < minTime) minTime = date.time;
                    if (date.time > maxTime) maxTime = date.time;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            minTime = new Date(minTime * 1000).getFullYear();
            maxTime = new Date(maxTime * 1000).getFullYear();

            this.setState({
                minTime: minTime,
                maxTime: maxTime,
                minCursorDate: minTime,
                maxCursorDate: minTime
            });
        }
    },
    _getAvailableYearsHtml: function _getAvailableYearsHtml(min, max) {
        var html = [];

        if (typeof this.state.timeScale === 'undefined') return null;

        var style = {
            width: this.state.timeScale + 'px'
        };

        for (min; min <= max; min++) {
            html.push(_react2.default.createElement(
                'div',
                { className: 'time-block', style: style, key: 'year-' + min, onClick: this._transitionTo.bind(this, min) },
                min
            ));
        }

        return html;
    },
    _handleMouseUp: function _handleMouseUp() {
        window.removeEventListener('mousemove', this._handdleDrag, true);
    },
    _handleMouseDown: function _handleMouseDown(cursor, event) {
        var _this3 = this;

        this.setState({
            animate: false,
            activeCursor: cursor,
            activeCursorOffsetClient: event.clientX - this.state[cursor + 'CursorX']
        }, function () {
            window.addEventListener('mousemove', _this3._handdleDrag, true);
        });
    },
    _handleResize: function _handleResize() {
        this._setWindowVars();
    },
    _addListeners: function _addListeners() {
        window.addEventListener('mouseup', this._handleMouseUp, false);
        window.addEventListener('resize', this._handleResize, false);
    },
    _removeListeners: function _removeListeners() {
        window.removeEventListener('mouseup', this._handleMouseUp, false);
        window.removeEventListener('resize', this._handleResize, false);
    },
    _setWindowVars: function _setWindowVars() {
        var time = this.state.maxTime - this.state.minTime;
        var wrapperSize = this.timelineWrapper.offsetWidth;
        var timeScale = wrapperSize / time;

        this.setState({
            wrapperSize: wrapperSize,
            timeScale: timeScale
        });
    },
    _updateValue: function _updateValue() {
        var _this4 = this;

        var minCursorDate = this.state.minTime + parseInt(this.state.minCursorX / this.state.timeScale);
        var maxCursorDate = this.state.minTime + parseInt(this.state.maxCursorX / this.state.timeScale);
        var minCursorTimestamp = this._getFirstDayTimestamp(minCursorDate);
        var maxCursorTimestamp = this._getLastDayTimestamp(maxCursorDate);

        this.setState({ minCursorDate: minCursorDate,
            maxCursorDate: maxCursorDate,
            minCursorTimestamp: minCursorTimestamp,
            maxCursorTimestamp: maxCursorTimestamp
        }, function () {
            _this4._handleChange();
        });
    },
    _getFirstDayTimestamp: function _getFirstDayTimestamp(year) {
        var date = new Date(year, 1, 1, 0, 0, 0, 0);
        return date.getTime() / 1000;
    },
    _getLastDayTimestamp: function _getLastDayTimestamp(year) {
        var date = new Date(year, 12, 31, 0, 0, 0, 0);
        return date.getTime() / 1000;
    },
    _transitionTo: function _transitionTo(year, event) {
        var _this5 = this;

        var activeCursor = undefined;

        if (year < this.state.minCursorDate) {
            activeCursor = 'min';
        }

        if (year > this.state.maxCursorDate) {
            activeCursor = 'max';
        }

        var clientX = event.clientX;

        this.setState({
            animate: true,
            activeCursor: activeCursor,
            activeCursorOffsetClient: this.props.cursorSize / 2
        }, function () {
            _this5._handdleDrag({ clientX: clientX });
        });
    },
    _setFastClick: function _setFastClick() {
        _fastclick2.default.attach(document.body);
    }
});

exports.default = Timeline;
