'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Timeless = _react2.default.createClass({
    displayName: 'Timeless',
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
            onChangeDelay: 0,
            cursorWidth: 75,
            cursorSnap: false,
            timeRangeDrag: false,
            cursorArrow: true,
            disabled: false,
            minTimestamp: 0,
            maxTimestamp: 0,
            minCursorDefaultTimestamp: 0,
            maxCursorDefaultTimestamp: 0,
            customMinMessage: null,
            customMaxMessage: null
        };
    },
    componentWillMount: function componentWillMount() {
        this._getMinMaxDates();
        this._addListeners();
        this.delay = null;
    },
    componentWillUnmount: function componentWillUnmount() {
        this._removeListeners();
    },
    componentDidMount: function componentDidMount() {
        this._setWindowVars();
    },
    render: function render() {
        var _this = this;

        var minCursorStyle = {
            transform: 'translate3d(' + this.state.minCursorX + 'px,0,0)',
            width: this.props.cursorWidth
        };

        var maxCursorStyle = {
            transform: 'translate3d(' + this.state.maxCursorX + 'px,0,0)',
            width: this.props.cursorWidth
        };

        var timeRangeStyle = {
            transform: 'translate3d(' + this.state.minCursorX + 'px,0,0)',
            width: this.state.maxCursorX - this.state.minCursorX + this.props.cursorWidth
        };

        var minCursorClass = 'time-cursor time-cursor--min';
        var maxCursorClass = 'time-cursor time-cursor--max';
        var timeRangeClass = 'timeline-range';
        var timelineWrapperClass = 'timeline-wrapper';

        if (this.state.animate) {
            //minCursorStyle.transition = maxCursorStyle.transition = timeRangeStyle.transition = 'all 0.25s ease';
            minCursorClass += ' timeline-animate';
            maxCursorClass += ' timeline-animate';
            timeRangeClass += ' timeline-animate';
        }

        if (this.props.cursorArrow) {
            minCursorClass += ' cursor-arrow';
            maxCursorClass += ' cursor-arrow';
        }

        if (this.props.disabled) timelineWrapperClass += ' timeline--disabled';

        return _react2.default.createElement(
            'div',
            { className: timelineWrapperClass, ref: function ref(_ref3) {
                    return _this.timelineWrapper = _ref3;
                } },
            _react2.default.createElement(
                'div',
                { className: 'timeline-available' },
                this._getAvailableYearsHtml(this.state.minTime, this.state.maxTime)
            ),
            _react2.default.createElement('div', { className: timeRangeClass, style: timeRangeStyle }),
            _react2.default.createElement(
                'div',
                { className: minCursorClass,
                    ref: function ref(_ref) {
                        return _this.minCursor = _ref;
                    },
                    style: minCursorStyle,
                    onMouseDown: this._handleMouseDown.bind(this, 'min'),
                    onTouchStart: this._handleMouseDown.bind(this, 'min')
                },
                this.state.minCursorLabel
            ),
            _react2.default.createElement(
                'div',
                { className: maxCursorClass,
                    ref: function ref(_ref2) {
                        return _this.maxCursor = _ref2;
                    },
                    style: maxCursorStyle,
                    onMouseDown: this._handleMouseDown.bind(this, 'max'),
                    onTouchStart: this._handleMouseDown.bind(this, 'max')
                },
                this.state.maxCursorLabel
            )
        );
    },
    _handleDrag: function _handleDrag(event) {
        var _this2 = this;

        if (this.props.disabled) return false;
        var state = {};

        var index = this.state.activeCursor;
        var cursorWidth = this.props.cursorWidth;
        var translateValue = event.clientX - this.state.activeCursorOffsetClient;

        if (index === 'max') {
            if (translateValue > this.state.wrapperSize - cursorWidth) translateValue = this.state.wrapperSize - cursorWidth;
            if (translateValue < this.state.minCursorX + cursorWidth) translateValue = this.state.minCursorX + cursorWidth;
        }

        if (index === 'min') {
            if (translateValue < 0) translateValue = 0;
            if (translateValue > this.state.maxCursorX - cursorWidth) translateValue = this.state.maxCursorX - cursorWidth;
        }

        state[index + 'CursorX'] = translateValue;

        this.setState(state, function () {
            _this2._updateValue();
        });
    },
    _handleChange: function _handleChange() {
        var _this3 = this;

        if (this.props.onChange !== null && typeof this.props.onChange === 'function') {
            clearTimeout(this.delay);

            this.delay = setTimeout(function () {
                _this3.props.onChange(_this3.state);
            }, this.props.onChangeDelay);
        }
    },
    _getMinMaxDates: function _getMinMaxDates() {
        var dates = this.props.dates;
        var _props = this.props;
        var minTimestamp = _props.minTimestamp;
        var maxTimestamp = _props.maxTimestamp;

        var minTime = undefined;
        var maxTime = undefined;

        if (minTimestamp && maxTimestamp && minTimestamp !== maxTimestamp) {
            minTime = minTimestamp;
            maxTime = maxTimestamp;
        } else {
            if (dates) {
                minTime = dates[0].start;
                maxTime = dates[0].start;

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = dates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var date = _step.value;

                        if (date.start < minTime) minTime = date.start;
                        if (date.start > maxTime) maxTime = date.start;
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
            }
        }

        minTime = new Date(minTime * 1000).getFullYear();
        maxTime = new Date(maxTime * 1000).getFullYear();

        this.setState({
            minTime: minTime,
            maxTime: maxTime,
            minCursorDate: minTime,
            maxCursorDate: maxTime
        });
    },
    _getAvailableYearsHtml: function _getAvailableYearsHtml(min, max) {
        var html = [];

        if (typeof this.state.timeScale === 'undefined') return null;

        var style = {
            width: this.state.timeScale + 'px'
        };

        for (min; min <= max; min++) {
            var className = "time-block--year";

            if (min > this.state.minCursorDate && min < this.state.maxCursorDate) className += " time-block--in-range";
            if (min === this.state.minCursorDate || min === this.state.maxCursorDate) className += " time-block--active";

            html.push(_react2.default.createElement(
                'div',
                { className: 'time-block', style: style, key: 'year-' + min, onClick: this._transitionTo.bind(this, min) },
                _react2.default.createElement(
                    'span',
                    { className: className },
                    min
                )
            ));
        }

        return html;
    },
    _handleMouseUp: function _handleMouseUp() {
        window.removeEventListener('mousemove', this._handleDrag, true);
    },
    _handleMouseDown: function _handleMouseDown(cursor, event) {
        var _this4 = this;

        this.setState({
            animate: false,
            activeCursor: cursor,
            activeCursorOffsetClient: event.clientX - this.state[cursor + 'CursorX']
        }, function () {
            window.addEventListener('mousemove', _this4._handleDrag, true);
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
        var _this5 = this;

        var time = this.state.maxTime - this.state.minTime + 1;
        var wrapperSize = this.timelineWrapper.offsetWidth;
        var wrapperOffsetLeft = this.timelineWrapper.offsetLeft;

        var _state = this.state;
        var minCursorX = _state.minCursorX;
        var maxCursorX = _state.maxCursorX;

        var timeScale = wrapperSize / time;

        if (timeScale < this.props.cursorWidth) {
            timeScale = this.props.cursorWidth;
        }

        if (this.state.timeScale) {
            minCursorX = this._getRepositionCursorX('min', timeScale);
            maxCursorX = this._getRepositionCursorX('max', timeScale);
        } else {
            var minTime = new Date(this.props.minCursorDefaultTimestamp * 1000).getFullYear();
            var maxTime = new Date(this.props.maxCursorDefaultTimestamp * 1000).getFullYear();

            minCursorX = this._getDateX(minTime, timeScale, wrapperSize);
            maxCursorX = this._getDateX(maxTime, timeScale, wrapperSize);
        }

        this.setState({
            animate: false,
            wrapperSize: wrapperSize,
            wrapperOffsetLeft: wrapperOffsetLeft,
            timeScale: timeScale,
            minCursorX: minCursorX,
            maxCursorX: maxCursorX
        }, function () {
            _this5._updateValue();
        });
    },
    _getCursorLabel: function _getCursorLabel() {
        var _state2 = this.state;
        var minTime = _state2.minTime;
        var maxTime = _state2.maxTime;
        var _props2 = this.props;
        var customMinMessage = _props2.customMinMessage;
        var customMaxMessage = _props2.customMaxMessage;

        var halfCursorWith = this.props.cursorWidth / 2;
        var minCursorDate = this.state.minTime + parseInt((this.state.minCursorX + halfCursorWith) / this.state.timeScale);
        var maxCursorDate = this.state.minTime + parseInt((this.state.maxCursorX + halfCursorWith) / this.state.timeScale);
        var minCursorLabel = minCursorDate === minTime && customMinMessage !== null ? customMinMessage : minCursorDate;
        var maxCursorLabel = maxCursorDate === maxTime && customMaxMessage !== null ? customMaxMessage : maxCursorDate;

        return { minCursorDate: minCursorDate, maxCursorDate: maxCursorDate, minCursorLabel: minCursorLabel, maxCursorLabel: maxCursorLabel };
    },
    _updateValue: function _updateValue() {
        var _this6 = this;

        var _getCursorLabel2 = this._getCursorLabel();

        var minCursorDate = _getCursorLabel2.minCursorDate;
        var maxCursorDate = _getCursorLabel2.maxCursorDate;
        var minCursorLabel = _getCursorLabel2.minCursorLabel;
        var maxCursorLabel = _getCursorLabel2.maxCursorLabel;

        if (minCursorDate === this.state.minCursorDate && maxCursorDate === this.state.maxCursorDate && minCursorLabel === this.state.minCursorLabel && maxCursorLabel === this.state.maxCursorLabel) return false;

        var minCursorTimestamp = this._getFirstDayTimestamp(minCursorDate);
        var maxCursorTimestamp = this._getLastDayTimestamp(maxCursorDate);

        this.setState({ minCursorDate: minCursorDate,
            maxCursorDate: maxCursorDate,
            minCursorLabel: minCursorLabel,
            maxCursorLabel: maxCursorLabel,
            minCursorTimestamp: minCursorTimestamp,
            maxCursorTimestamp: maxCursorTimestamp
        }, function () {
            _this6._handleChange();
        });
    },
    _getFirstDayTimestamp: function _getFirstDayTimestamp(year) {
        var date = new Date(year, 0, 1, 0, 0, 0, 0);
        return date.getTime() / 1000;
    },
    _getLastDayTimestamp: function _getLastDayTimestamp(year) {
        var date = new Date(year, 11, 31, 0, 0, 0, 0);
        return date.getTime() / 1000;
    },
    _transitionTo: function _transitionTo(year, event) {
        var _this7 = this;

        var minCursorDiff = Math.abs(year - this.state.minCursorDate);
        var maxCursorDiff = Math.abs(year - this.state.maxCursorDate);
        var activeCursor = minCursorDiff < maxCursorDiff ? 'min' : 'max';
        var clientX = event.clientX - this.state.wrapperOffsetLeft;
        var activeCursorOffsetClient = year === this.state.maxTime ? -this.props.cursorWidth : this.props.cursorWidth / 2;

        this.setState({
            activeCursor: activeCursor,
            activeCursorOffsetClient: activeCursorOffsetClient,
            animate: true
        }, function () {
            _this7._handleDrag({ clientX: clientX });
        });
    },
    _getRepositionCursorX: function _getRepositionCursorX(cursor, newTimescale) {
        return this.state[cursor + 'CursorX'] * newTimescale / this.state.timeScale;
    },
    _getDateX: function _getDateX(year, timeScale) {
        var currentTimeScale = timeScale ? timeScale : this.state.timeScale;
        var dateX = (year - this.state.minTime) * currentTimeScale;

        if (year === this.state.maxTime) {
            dateX = dateX + (currentTimeScale - this.props.cursorWidth);
        }

        return dateX;
    }
});

exports.default = Timeless;
