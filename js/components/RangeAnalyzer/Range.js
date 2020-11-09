import React from 'react';
import { hands, } from './utils.js';
var nj = require('numjs');
var d3 = require("d3");

class Range extends React.Component {
    static defaultProps = {
        tileWidth: 30,
        borderWidth: 1,
        borderColor: "#000",
        gapWidth: 2,
        radius: 3,
        colors: {
            "unselected-offsuit": "#fdc5be",
            "unselected-paired": "#aedef4",
            "unselected-suited": "#fff9b4",
            "selected": "#888888",
            "selected-offsuit": "#eb3219",
            "selected-paired": "#0d4cd9",
            "selected-suited": "#cc9421",
        },
        style: {},
    }

    state = {
        down: false,
        selected: new Array(13 * 13).map((e) => { return false }),
        data: nj.zeros([13, 13]),
        mask: false,
    }

    componentDidMount() {
        var canvasWidth = (this.props.tileWidth + this.props.gapWidth) * 13;

        this.partner = this.props.id + '-partner'
        var svg = d3.select('#' + this.partner)
            .append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasWidth)
            .append("g");

        var rects = svg.selectAll("rect")
            .data([...this.state.selected.keys()])
            .enter()
            .append("g")
            .append("rect")
            .attr("width", this.props.tileWidth)
            .attr("height", this.props.tileWidth)
            .attr("fill", function (d, i) {
                var x = i % 13;
                var y = Math.trunc(i / 13);
                if (this.state.selected[i]) {
                    if (x < y) {
                        return this.props.colors['selected-offsuit']
                    } else if (x > y) {
                        return this.props.colors['selected-suited']
                    } else {
                        return this.props.colors['selected-paired']
                    }
                } else {
                    if (x < y) {
                        return this.props.colors['unselected-offsuit']
                    } else if (x > y) {
                        return this.props.colors['unselected-suited']
                    } else {
                        return this.props.colors['unselected-paired']
                    }
                }
            }.bind(this))
            .attr("stroke", this.props.borderColor)
            .attr("stroke-width", this.props.borderWidth)
            .attr("rx", this.props.radius)
            .attr("ry", this.props.radius)
            .attr("box-sizing", "border-box")
            .attr("transform", function (d, i) {
                var x = (i % 13) * (this.props.tileWidth + this.props.gapWidth);
                var y = Math.trunc(i / 13) * (this.props.tileWidth + this.props.gapWidth);
                return "translate(" + x + "," + y + ")";
            }.bind(this));

        var texts = svg.selectAll("g")
            .append("text")
            .attr("transform", function (d, i) {
                var x = ((i % 13) + 0.45) * (this.props.tileWidth + this.props.gapWidth);
                var y = (Math.trunc(i / 13) + 0.5) * (this.props.tileWidth + this.props.gapWidth);
                return "translate(" + x + "," + y + ")";
            }.bind(this))
            .attr("font-size", "12")
            .attr("color", "black")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("user-select", "none")
            .attr("cursor", "default")
            .attr("pointer-events", "none")
            .text(function (d, i) { return hands[i]; })

        var range = this;
        svg.selectAll('rect')
            .on('mousedown', function (d, i) {
                range.state.down = true;
                range.state.selected[i] = !range.state.selected[i];
                range.state.mask = range.state.selected[i];

                var x = i % 13;
                var y = Math.trunc(i / 13);
                if (range.state.selected[i]) {
                    if (x < y) {
                        d3.select(this).attr("fill", range.props.colors['selected-offsuit']);
                    } else if (x > y) {
                        d3.select(this).attr("fill", range.props.colors['selected-suited']);
                    } else {
                        d3.select(this).attr("fill", range.props.colors['selected-paired']);
                    }
                } else {
                    if (x < y) {
                        d3.select(this).attr("fill", range.props.colors['unselected-offsuit']);
                    } else if (x > y) {
                        d3.select(this).attr("fill", range.props.colors['unselected-suited']);
                    } else {
                        d3.select(this).attr("fill", range.props.colors['unselected-paired']);
                    }
                }
            });
        svg.selectAll('rect')
            .on('mouseover', function (d, i) {
                if (range.state.down) {
                    if (range.state.selected[i] !== range.state.mask) {
                        range.state.selected[i] = range.state.mask;
                        var x = i % 13;
                        var y = Math.trunc(i / 13);
                        if (range.state.selected[i]) {
                            if (x < y) {
                                d3.select(this).attr("fill", range.props.colors['selected-offsuit']);
                            } else if (x > y) {
                                d3.select(this).attr("fill", range.props.colors['selected-suited']);
                            } else {
                                d3.select(this).attr("fill", range.props.colors['selected-paired']);
                            }
                        } else {
                            if (x < y) {
                                d3.select(this).attr("fill", range.props.colors['unselected-offsuit']);
                            } else if (x > y) {
                                d3.select(this).attr("fill", range.props.colors['unselected-suited']);
                            } else {
                                d3.select(this).attr("fill", range.props.colors['unselected-paired']);
                            }
                        }
                    }
                }
            });
        window.addEventListener('mouseup', function (event) {
            if (range.state.down) {
                range.state.down = false;

                // update happens here - send new state to parent
                var new_range = nj.array(range.state.selected, 'uint8').reshape([13, 13]);
                range.props.onMouseUp({range: new_range})
            }
        })
    }

    render() {
        return (
            <div id={"#" + this.props.id} style={this.props.style}>
                <h2>Range</h2>
                <div id={this.props.id + '-partner'} />
            </div>
        )
    }
}

export default Range;