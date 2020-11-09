import React from 'react';
import ReactDOM from 'react-dom';
import PrimaryNavbar from './components/navbar.jsx';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Slider from 'react-rangeslider';

import '../css/bootstrap.css';
import '../css/rangeslider.min.css';
import '../css/rejam.css';

const axios = require('axios').default;

class CustomInputRow extends React.Component {
    static defaultProps = {
        label: "Row Label",
        reff: "",
        style: {width: '100%'},
        step: 1,
        min: 0,
        max: 10,
        defaultValue: 0,
        onChange: null,
    }
    state = {
        input: "",
        slider: 0,
        val: 0,
    }
    constructor(props) {
        super(props);
        this.state = {
            input: this.props.defaultValue.toString(),
            slider: this.props.defaultValue,
        };
        if (props.onChange !== null) {
            props.onChange(this.props.defaultValue.toString())
        }
    }
    render() {
        return (
            <Container style={this.props.style}>
                <Row>
                    <Col className="form-label-container" xs={6}>
                        <Form.Label className="form-label">{this.props.label}</Form.Label>
                    </Col>
                    <Col xs={2} className="form-control-container">
                        <Form.Control
                            className="form-control"
                            type="text"
                            ref={this.props.reff}
                            value={this.state.input}
                            onChange={
                                (e) => {
                                    var val = e.target.value ? parseFloat(e.target.value) : this.props.min;
                                    this.setState({ input: e.target.value, slider: val, })
                                    if (this.props.onChange !== null) {
                                        this.props.onChange(val);
                                    }
                                }
                            }
                        />
                    </Col>
                    <Col xs={4} className="form-slider-container">
                        <Slider
                            className="slider"
                            orientation='horizontal'
                            tooltip={false}
                            step={this.props.step}
                            min={this.props.min}
                            max={this.props.max}
                            labels={{ }}
                            value={this.state.slider}
                            onChange={
                                (e) => {
                                    this.setState({ slider: e, input: e.toString() })
                                    
                                    if (this.props.onChange !== null) {
                                        this.props.onChange(e);
                                    }
                                }
                            }
                            style={{width: 150}}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }
}

const make_percents_decimals = function(params) {
    params = Object.assign({}, params);
    params.villain_pfr = params.villain_pfr / 100;
    params.villain_call = params.villain_call / 100;
    params.equity_when_called = params.equity_when_called / 100;
    params.behind_call = params.behind_call / 100;
    params.equity_vs_behind = params.equity_vs_behind / 100;
    return params;
}
const make_decimals_percents = function(data) {
    data = Object.assign({}, data);
    data.prob_villain_call = data.prob_villain_call * 100;
    data.prob_behind_call = data.prob_behind_call * 100;
    data.prob_all_fold = data.prob_all_fold * 100;
    return data;
}

class RejamPrompt extends React.Component {
    render() {
        return (
            <div className="rejam-prompt">
                <p>Suppose you are in the following situation.</p>

                <p>You are sitting 24BB deep in the middle stages of a 9-max MTT (BB ante).</p>
                
                <p>It folds to the CO, a big stack who has been bullying the table, who opens to 2.5BB. It folds to you in the SB.</p>

                <p>The following calculator approximately models the profitability of reshoving in this situation.</p>
            </div>
        )
    }
}

class RejamAssumptions extends React.Component {
    render() {
        return (
            <div className="rejam-assumptions">
                <p style={{fontSize: '0.6em'}}><span style={{color: 'red'}}>Note:</span> For the sake of simplicity, it is assumed that there will be at most one caller. Since the calling ranges are fairly narrow to begin with, this assumption translates to only a marginal skew from the true expected values. If there are multiple callers, our equity will be much worse than we have approximated, so in reality our EV will be slightly less than the approximations indicate.</p>
            </div>
        )
    }
}

class RejamCalculator extends React.Component {
    static defaultProps = {
        defaultValues: {
            effective_stack: 24,
            total_antes: 1,
            open_size: 2.5,
            villain_pfr: 25,
            villain_call: 8,
            equity_when_called: 30,
            still_to_act: 1,
            behind_call: 6,
            equity_vs_behind: 24,
        },
    }
    state = {
        statusText: "",
        success: false,
        probVillainCall: "",
        probBehindCall: "",
        probAllFold: "",
        EV_VillainCall: "",
        EV_BehindCall: "",
        EV_AllFold: "",
        EV_Total: "",
    }

    componentDidMount() {
        this.setState(this.props.defaultValues)
        this.postData(make_percents_decimals(this.props.defaultValues))
    }

    handleCompute(e) {
        e.preventDefault()
        if (!this.state.effective_stack
            || !this.state.total_antes
            || !this.state.open_size
            || !this.state.villain_pfr
            || !this.state.villain_call
            || !this.state.equity_when_called
            || !this.state.still_to_act
            || !this.state.behind_call
            || !this.state.equity_when_called
            || !this.state.equity_vs_behind) {
                this.setState({
                    statusText: "missing values",
                    success: false,
                    probVillainCall: "",
                    probBehindCall: "",
                    probAllFold: "",
                    EV_VillainCall: "",
                    EV_BehindCall: "",
                    EV_AllFold: "",
                    EV_Total: "",
                })
        } else {
            var stats = make_percents_decimals(this.state);
            this.postData(stats);
        }
    }

    postData(stats) {
        axios.post('https://0.0.0.0:3000/api/rejam', stats)
            .then(response => {
                var data = make_decimals_percents(response.data.data);
                this.setState({
                    statusText: "",
                    success: true,
                    probVillainCall: data.prob_villain_call.toFixed(0),
                    probBehindCall: data.prob_behind_call.toFixed(0),
                    probAllFold: data.prob_all_fold.toFixed(0),
                    EV_VillainCall: data.EV_villain_call.toFixed(1),
                    EV_BehindCall: data.EV_behind_call.toFixed(1),
                    EV_AllFold: data.EV_all_fold.toFixed(1),
                    EV_Total: data.EV_total.toFixed(1),
                })
            })
            .catch(error => {
                this.setState({
                    statusText: error,
                    success: false,
                    probVillainCall: "",
                    probBehindCall: "",
                    probAllFold: "",
                    EV_VillainCall: "",
                    EV_BehindCall: "",
                    EV_AllFold: "",
                    EV_Total: "",
                })
            });
    }

    onParameterChange(parameter_name) {
        const f = function(new_value) {
            const updateDict = {}
            updateDict[parameter_name] = new_value
            this.setState(updateDict)
        }
        return f;
    }

    render() {
        return (
            <Container className="Rejam">
                <PrimaryNavbar />
                <Container className="rejam-calculator">
                    <h1>Rejam Calculator</h1>
                    <RejamPrompt />
                    <Form className="Form" onSubmit={this.handleCompute.bind(this)}>
                        <Form.Group controlId="exampleForm.ControlInput1">
                            <Row>
                                <CustomInputRow
                                    label="Effective stack (BB)"
                                    reff="effective_stack"
                                    step={1}
                                    min={1}
                                    max={35}
                                    onChange={this.onParameterChange("effective_stack").bind(this)}
                                    defaultValue={this.props.defaultValues.effective_stack}
                                />
                            </Row>
                            <Row>
                                <CustomInputRow
                                    label="Total antes (BB)"
                                    reff="total_antes"
                                    step={0.1}
                                    min={0}
                                    max={2}
                                    onChange={this.onParameterChange("total_antes").bind(this)}
                                    defaultValue={this.props.defaultValues.total_antes}
                                />
                            </Row>
                            <Row>
                                <CustomInputRow
                                    label="Villain open size (BB)"
                                    reff="open_size"
                                    step={0.25}
                                    min={2}
                                    max={5}
                                    onChange={this.onParameterChange("open_size").bind(this)}
                                    defaultValue={this.props.defaultValues.open_size}
                                />
                            </Row>
                            <Row style={{height: '1em'}}></Row>
                            <Row>
                                <CustomInputRow
                                    label="% of hands villain opens"
                                    reff="villain_pfr"
                                    step={1}
                                    min={0}
                                    max={100}
                                    onChange={this.onParameterChange("villain_pfr").bind(this)}
                                    defaultValue={this.props.defaultValues.villain_pfr}
                                />
                            </Row>
                            <Row>
                                <CustomInputRow
                                    label="% of hands villain calls reshove"
                                    reff="villain_call"
                                    step={1}
                                    min={0}
                                    max={100}
                                    onChange={this.onParameterChange("villain_call").bind(this)}
                                    defaultValue={this.props.defaultValues.villain_call}
                                />
                            </Row>
                            <Row>
                                <CustomInputRow
                                    label="Hero's equity (%) if called by villain"
                                    reff="equity_when_called"
                                    step={1}
                                    min={0}
                                    max={100}
                                    onChange={this.onParameterChange("equity_when_called").bind(this)}
                                    defaultValue={this.props.defaultValues.equity_when_called}
                                />
                            </Row>
                            <Row style={{height: '1em'}}></Row>
                            <Row>
                                <CustomInputRow
                                    label="Players still to act"
                                    reff="still_to_act"
                                    step={1}
                                    min={0}
                                    max={9}
                                    onChange={this.onParameterChange("still_to_act").bind(this)}
                                    defaultValue={this.props.defaultValues.still_to_act}
                                />
                            </Row>
                            <Row>
                                <CustomInputRow
                                    label="% of hands players behind call reshove"
                                    reff="behind_call"
                                    step={1}
                                    min={0}
                                    max={100}
                                    onChange={this.onParameterChange("behind_call").bind(this)}
                                    defaultValue={this.props.defaultValues.behind_call}
                                />
                            </Row>
                            <Row>
                                <CustomInputRow
                                    label="Hero's equity (%) if called by player behind"
                                    reff="equity_vs_behind"
                                    step={1}
                                    min={0}
                                    max={100}
                                    onChange={this.onParameterChange("equity_vs_behind").bind(this)}
                                    defaultValue={this.props.defaultValues.equity_vs_behind}
                                />
                            </Row>
                        </Form.Group>
                        <RejamAssumptions />
                        <Row className="button-container">
                            <Button className="button" variant="primary" type="submit">Compute</Button>
                            <div className="button-text">{this.state.statusText}</div>
                        </Row>
                    </Form>
                    <Container className="results">
                        <Row>
                            <Col className="results-label" xs={9}><strong>Prob Villain calls</strong></Col>
                            <Col className="results-value" xs={3} style={{textAlign: 'center'}}>{this.state.success ? this.state.probVillainCall + "%" : ""}</Col>
                        </Row>
                        <Row>
                            <Col className="results-label" xs={9}><strong>EV when Villain calls</strong></Col>
                            <Col className="results-value" xs={3} style={{textAlign: 'center'}}>{this.state.success ? this.state.EV_VillainCall + " BB" : ""}</Col>
                        </Row>
                        <Row style={{height: '1em'}}></Row>
                        <Row>
                            <Col className="results-label" xs={9}><strong>Prob any behind call</strong></Col>
                            <Col className="results-value" xs={3} style={{textAlign: 'center'}}>{this.state.success ? this.state.probBehindCall + "%" : ""}</Col>
                        </Row>
                        <Row>
                            <Col className="results-label" xs={9}><strong>EV when any behind call</strong></Col>
                            <Col className="results-value" xs={3} style={{textAlign: 'center'}}>{this.state.success ? this.state.EV_BehindCall + " BB" : ""}</Col>
                        </Row>
                        <Row style={{height: '1em'}}></Row>
                        <Row>
                            <Col className="results-label" xs={9}><strong>Prob all fold</strong></Col>
                            <Col className="results-value" xs={3} style={{textAlign: 'center'}}>{this.state.success ? this.state.probAllFold + "%" : ""}</Col>
                        </Row>
                        <Row>
                            <Col className="results-label" xs={9}><strong>EV when all fold</strong></Col>
                            <Col className="results-value" xs={3} style={{textAlign: 'center'}}>{this.state.success ? this.state.EV_AllFold+ " BB" : ""}</Col>
                        </Row>
                        <Row style={{height: '1em'}}></Row>
                        <Row>
                            <Col className="results-label" xs={9}><strong>Net from reshoving</strong></Col>
                            <Col className="results-value" xs={3} style={{textAlign: 'center'}}>{this.state.success ? this.state.EV_Total+ " BB" : ""}</Col>
                        </Row>
                    </Container>
                </Container>
            </Container>
        )
    }
}

ReactDOM.render(<RejamCalculator />, document.getElementById('rejam'));