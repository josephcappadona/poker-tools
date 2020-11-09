import React from 'react';
import { suits, cards } from './utils.js';
var nj = require('numjs');
var d3 = require("d3");

class BoardDisplay extends React.Component {
    static defaultProps = {
        style: {},
        cards: [],
    }

    render() {
        return (
            <div style={{width: '150px', marginLeft: '6px'}}>
                {this.props.cards.slice(0, 3).join(' ')} {this.props.cards.slice(3, 4).join(' ')} {this.props.cards.slice(4, 5).join(' ')}
            </div>
        )
    }
}

class Board extends React.Component {
    static defaultProps = {
        tileWidth: 30,
        borderWidth: 1,
        borderColor: "#000",
        gapWidth: 2,
        radius: 3,
        colors: {
            "unselected-s": "#C7C7C7",
            "unselected-h": "#FDADAD",
            "unselected-d": "#9FD7FD",
            "unselected-c": "#ABEA74",
            "selected-s": "#444444",
            "selected-h": "#FF4444",
            "selected-d": "#0D5CC7",
            "selected-c": "#3a9e1f",
        },
        style: {},
    }

    state = {
        selected: new Array(4 * 13).map((e) => { return false }),
        data: nj.zeros([4, 13]),
        n_selected: 0,
        cards: new Array(),
        i_down: -1,
    }

    componentDidMount() {
        var board = this;

        var canvasWidth = (this.props.tileWidth + this.props.gapWidth) * 4;
        var canvasHeight = (this.props.tileWidth + this.props.gapWidth) * 13;

        this.partner = this.props.id + '-partner'
        var svg = d3.select('#' + this.partner)
            .append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight)
            .append("g");

        svg.selectAll("rect")
            .data([...this.state.selected.keys()])
            .enter()
            .append("g")
            .append("rect")
            .attr("width", this.props.tileWidth)
            .attr("height", this.props.tileWidth)
            .attr("fill", function (d, i) {
                var x = i % 4;
                var prefix = this.state.selected[i] ? "selected-" : "unselected-";
                return this.props.colors[prefix + suits[x]];
            }.bind(this))
            .attr("stroke", this.props.borderColor)
            .attr("stroke-width", this.props.borderWidth)
            .attr("rx", this.props.radius)
            .attr("ry", this.props.radius)
            .attr("box-sizing", "border-box")
            .attr("transform", function (d, i) {
                var x = (i % 4) * (this.props.tileWidth + this.props.gapWidth);
                var y = Math.trunc(i / 4) * (this.props.tileWidth + this.props.gapWidth);
                return "translate(" + x + "," + y + ")";
            }.bind(this));

        svg.selectAll("g")
            .append("text")
            .attr("transform", function (d, i) {
                var x = ((i % 4) + 0.45) * (this.props.tileWidth + this.props.gapWidth);
                var y = (Math.trunc(i / 4) + 0.5) * (this.props.tileWidth + this.props.gapWidth);
                return "translate(" + x + "," + y + ")";
            }.bind(this))
            .attr("font-size", "12")
            .attr("color", "black")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .attr("user-select", "none")
            .attr("cursor", "default")
            .attr("pointer-events", "none")
            .text(function (d, i) { return cards[i]; })

        svg.selectAll('rect')
            .on('mousedown', function (d, i) {
                board.state.i_down = i;
            });
        svg.selectAll('rect')
            .on('mouseup', function (d, i) {
                if (i == board.state.i_down) {
                    if (board.state.selected[i] || (!board.state.selected[i] && board.state.n_selected < 5)) {
                        board.state.selected[i] = !board.state.selected[i];

                        var card = cards[d];
                        if (board.state.selected[i]) {
                            // add card to board array
                            board.state.cards.push(card);
                        } else {
                            // remove card from board array
                            var idx = board.state.cards.indexOf(card);
                            board.state.cards = board.state.cards.slice(0, idx).concat(board.state.cards.slice(idx + 1, board.state.cards.length))
                        }
                        board.state.n_selected = board.state.cards.length;

                        var x = i % 4;
                        var y = Math.trunc(i / 4);
                        var prefix = board.state.selected[i] ? "selected-" : "unselected-";
                        var color = board.props.colors[prefix + suits[x]];
                        d3.select(this).attr("fill", color);

                        board.props.onMouseUp({board: board.state.cards});
                    }
                }
                board.state.i_down = -1;
            });
    }

    render() {
        return (
            <div id={"#" + this.props.id} style={this.props.style}>
                <h2>Board</h2>
                <div id={this.props.id + '-partner'} />
                <BoardDisplay cards={this.state.cards} />
            </div>
        )
    }
}

export default Board;