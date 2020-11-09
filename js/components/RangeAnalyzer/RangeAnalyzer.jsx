import React from 'react';
var nj = require('numjs');

import Range from './Range.js';
import Board from './Board.js';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Statistics, { madeHandStatsDefault, drawStatsDefault, comboDrawStatsDefault } from './Statistics.js';


const axios = require('axios').default;

const defaultToggles = {
    madeHandStats: Object.assign({}, madeHandStatsDefault),
    drawStats: Object.assign({}, drawStatsDefault),
    comboDrawStats: Object.assign({}, comboDrawStatsDefault),
};
const defaultStatistics = {
    madeHandStats: Object.assign({}, madeHandStatsDefault),
    drawStats: Object.assign({}, drawStatsDefault),
    comboDrawStats: Object.assign({}, comboDrawStatsDefault),
};
const defaultSummaryStatistics = {
    madeHandStats: 0,
    drawStats: 0,
    comboDrawStats: 0
};
const defaultSummaryStatistic = 0;
const defaultNCombos = 0;

class RangeAnalyzer extends React.Component {
    state = {
        range: nj.zeros([13, 13]),
        board: new Array(),
        toggles: Object.assign({}, defaultToggles),

        stats: Object.assign({}, defaultStatistics),
        summaryStatistics: Object.assign({}, defaultSummaryStatistics),
        summaryStatistic: defaultSummaryStatistic,
        nCombos: defaultNCombos,
        statusText: "",
    }

    rangeStateChanged(data) {
        console.log(data.range.tolist());
        this.setState({
            range: data.range
        });
    }

    boardStateChanged(data) {
        console.log(data.board);
        this.setState({
            board: data.board
        });
    }

    statToggled(data) {
        console.log(data.toggles);
        this.setState({
            toggles: data.toggles,
        })
    }

    computeStats() {
        console.log("COMPUTE");
        const info = {
            range: this.state.range,
            board: this.state.board,
            toggles: this.state.toggles
        }
        axios.post('https://0.0.0.0:3000/api/analyzer', info)
            .then(response => {
                const {statistics, summaryStatistics, summaryStatistic, nCombos} = response.data.data.data;
                this.setState({
                    statusText: "",
                    stats: statistics,
                    summaryStatistics: summaryStatistics,
                    summaryStatistic: summaryStatistic,
                    nCombos: nCombos,
                })
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    statusText: "error encountered, try again",
                    stats: Object.assign({}, defaultStatistics),
                    summaryStatistics: Object.assign({}, defaultSummaryStatistics),
                    summaryStatistic: defaultSummaryStatistic,
                    nCombos: defaultNCombos,
                })
            });
    }

    render() {
        return (
            <div style={{display: 'block'}}>
                <Container style={{display: 'flex'}}>
                    <Range
                        id="primary-range"
                        style={{padding: '10px'}}
                        onMouseUp={this.rangeStateChanged.bind(this)}
                    />
                    <Board
                        id="primary-board"
                        style={{padding: '10px'}}
                        onMouseUp={this.boardStateChanged.bind(this)}
                    />
                    <Statistics
                        style={{padding: '10px'}}
                        onToggle={this.statToggled.bind(this)}
                        stats={this.state.stats}
                        summaryStatistics={this.state.summaryStatistics}
                        summaryStatistic={this.state.summaryStatistic}
                        nCombos={this.state.nCombos}
                    />
                </Container>
                <div>
                    <Button
                        className="button"
                        variant="primary"
                        onClick={this.computeStats.bind(this)}>
                            Compute
                    </Button>
                    <div className="button-text">{this.state.statusText}</div>
                </div>
            </div>
        );
    }
}

export default RangeAnalyzer;