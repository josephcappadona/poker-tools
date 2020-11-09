import React from 'react';

export class Bar extends React.Component {
    static defaultProps = {
        id: "bar",
        value: 0.5,
        textColor: "#444444",
        textSize: 12,
        barColor: "#AAAAFF",
        borderColor: "#000000",
        borderWidth: 0.25,
        width: 100,
        height: 18,
        format: null,
        paddingRight: 50,
        valueTextPadding: 5
    }

    render() {
        return (
            <svg id={this.props.id}
                style={{
                    height: this.props.height,
                    width: this.props.width + this.props.paddingRight,
                }}>

                <rect
                    x={0}
                    y={0}
                    height={this.props.height}
                    width={this.props.value * this.props.width}
                    fill={this.props.barColor}
                    stroke={this.props.borderColor}
                    strokeWidth={this.props.borderWidth * 2}
                />
                <text
                    transform={"translate(" + (this.props.value * this.props.width + this.props.valueTextPadding) + "," + (this.props.height / 2) + ")"}
                    fontSize={this.props.fontSize}
                    color={this.props.textColor}
                    textAnchor="start"
                    dominantBaseline="central"
                    pointerEvents="none"
                    cursor="default">
                    {(this.props.format !== null ? this.props.format(this.props.value) : this.props.value).toString()}
                </text>
            </svg>
        )
    }
}


export class BarLabel extends React.Component {
    static defaultProps = {
        id: 'bar-label',
        width: 120,
        height: 18,
        label: 'Label',
        paddingRight: 5,
    }

    render() {
        return (
            <svg
                id={this.props.id}
                width={this.props.width}
                height={this.props.height}
                style={{paddingRight: this.props.paddingRight}}>
                <text
                    x="100%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="end">
                    {this.props.label}
                </text>
            </svg>
        )
    }
}