import React from 'react';
var nj = require('numjs');
import Form from 'react-bootstrap/Form';
import { Bar, BarLabel } from './Bar.js';
import { madeHandTypes, drawTypes, comboDrawTypes, enumerateCombosInRange, convertRangeToHands } from './utils.js';
var Hand = require('pokersolver').Hand;


class StatRow extends React.Component {
    static defaultProps = {
        i: -1,
        value: 0,
        id: 'stat-row',
        label: 'Label',
        barWidth: 150,
        textWidth: 120,
        height: 18,
        onToggle: null,
        barColor: "#AAAAFF",
        paddingRight: 50,
        labelTextPadding: 5,
    }
    toggled() {
        if (this.props.onToggle != null) {
            this.props.onToggle(this.props.i);
        }
    }
    render() {
        return (
            <div
                id={this.props.id}
                style={{
                    width: this.props.textWidth + this.props.barWidth + this.props.paddingRight,
                    height: this.props.height,
                    display: 'flex'
                }}>

                <Form.Check
                    type="checkbox"
                    id={this.props.id + '-checkbox'}
                    onChange={this.toggled.bind(this)}
                />
                <BarLabel
                    id={this.props.id + '-bar-label'}
                    width={this.props.textWidth}
                    height={this.props.height}
                    label={this.props.label}
                    labelTextPadding={this.props.labelTextPadding}
                />
                <Bar
                    id={this.props.id + '-stat-bar'}
                    value={this.props.value}
                    height={this.props.height}
                    width={this.props.barWidth}
                    format={v => {
                        var z = Number.parseFloat(v).toPrecision(3);
                        z = (z * 1000).toFixed(0);
                        return z / 10 + '%'
                    }}
                    barColor={this.props.barColor}
                    paddingRight={this.props.paddingRight}
                />
            </div>
        )
    }
}

class HandStatistics extends React.Component {
    static defaultProps = {
        type: null,
        onToggle: null,
        stats: {},
        handTypes: [],
        barColor: "#AAAAFF",
        summaryStatistic: 0,
        nCombos: 0,
    }

    state = {
        toggles: new Array(madeHandTypes.length).fill(0),
    }

    rowToggle(i) {
        // handle the toggle by updating the state and summary statistic
        this.setState(state => {
            state.toggles[i] = 1 - state.toggles[i];
            return state;
        }, function () {
            if (this.props.onToggle != null) {
                this.props.onToggle(this.state.toggles);
            }
        })        
    }

    render() {
        return (
            <div>
                <div>
                    {this.props.handTypes.map((hand, i) => {
                        return <StatRow
                            key={i}
                            i={i}
                            id={this.props.type + '-stat-row-' + i}
                            label={hand}
                            value={this.props.nCombos > 0 ? this.props.stats[hand] / this.props.nCombos : 0}
                            onToggle={this.rowToggle.bind(this)}
                            barColor={this.props.barColor}
                        />
                    })}
                </div>
                <div>
                    {(this.props.nCombos > 0 ? 100 * this.props.summaryStatistic / this.props.nCombos : 0).toFixed(1)}%
                </div>
            </div>
        )
    }
}


export const madeHandStatsDefault = {};
madeHandTypes.forEach(handType => madeHandStatsDefault[handType] = 0);

export const drawStatsDefault = {};
drawTypes.forEach(handType => drawStatsDefault[handType] = 0);

export const comboDrawStatsDefault = {};
comboDrawTypes.forEach(handType => comboDrawStatsDefault[handType] = 0);


class Statistics extends React.Component {
    static defaultProps = {
        style: {},
        onToggle: null,
        stats: {
            madeHandStats: Object.assign({}, madeHandStatsDefault),
            drawStats: Object.assign({}, drawStatsDefault),
            comboDrawStats: Object.assign({}, comboDrawStatsDefault),
        },
        summaryStatistics: {
            madeHandStats: 0,
            drawStats: 0,
            comboDrawStats: 0
        },
        summaryStatistic: 0,
        nCombos: 0,
    }

    state = {
        toggles: {
            madeHandStats: Object.assign({}, madeHandStatsDefault),
            drawStats: Object.assign({}, drawStatsDefault),
            comboDrawStats: Object.assign({}, comboDrawStatsDefault),
        },
    }

    madeHandStatToggled(madeHandToggles) {
        console.log('MADE HAND STAT TOGGLED');
        var toggles = {};
        for (var i=0; i < madeHandToggles.length; i++) {
            toggles[madeHandTypes[i]] = madeHandToggles[i];
        }
        this.setState(state => {
            state.toggles.madeHandStats = toggles;
            return state;
        }, function () {
            if (this.props.onToggle != null) {
                this.props.onToggle(this.state);
            }
        })
    }

    drawStatToggled(drawHandToggles) {
        console.log('DRAW STAT TOGGLED');
        var toggles = {};
        for (var i=0; i < drawHandToggles.length; i++) {
            toggles[drawTypes[i]] = drawHandToggles[i];
        }
        this.setState(state => {
            state.toggles.drawStats = toggles;
            return state;
        }, function () {
            if (this.props.onToggle != null) {
                this.props.onToggle(this.state);
            }
        })
    }

    comboDrawStatToggled(comboDrawHandToggles) {
        console.log('DRAW STAT TOGGLED');
        var toggles = {};
        for (var i=0; i < comboDrawHandToggles.length; i++) {
            toggles[comboDrawTypes[i]] = comboDrawHandToggles[i];
        }
        this.setState(state => {
            state.toggles.comboDrawStats = toggles;
            return state;
        }, function () {
            if (this.props.onToggle != null) {
                this.props.onToggle(this.state);
            }
        })
    }

    render() {
        return (
            <div style={this.props.style}>
                <h2>Statistics</h2>
                <HandStatistics
                    type='made-hands'
                    handTypes={Object.keys(this.props.stats.madeHandStats)}
                    stats={this.props.stats.madeHandStats}
                    summaryStatistic={this.props.summaryStatistics.madeHandStats}
                    nCombos={this.props.nCombos}
                    onToggle={this.madeHandStatToggled.bind(this)}
                    barColor='#0F66CC'
                />
                <HandStatistics
                    type='draws'
                    handTypes={Object.keys(this.props.stats.drawStats)}
                    stats={this.props.stats.drawStats}
                    summaryStatistic={this.props.summaryStatistics.drawStats}
                    nCombos={this.props.nCombos}
                    onToggle={this.drawStatToggled.bind(this)}
                    barColor='#217F15'
                />
                <HandStatistics
                    type='combo-draws'
                    handTypes={Object.keys(this.props.stats.comboDrawStats)}
                    stats={this.props.stats.comboDrawStats}
                    summaryStatistic={this.props.summaryStatistics.comboDrawStats}
                    nCombos={this.props.nCombos}
                    onToggle={this.comboDrawStatToggled.bind(this)}
                    barColor='#9F25CF'
                />
                <div>{(this.props.nCombos > 0 ? this.props.summaryStatistic / this.props.nCombos : 0).toFixed(3)*100}%</div>
            </div>
        )
    }
}

export default Statistics;