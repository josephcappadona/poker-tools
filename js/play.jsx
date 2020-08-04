import React from "react";
import ReactDOM from 'react-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PrimaryNavbar from './components/navbar.jsx';
import '../css/bootstrap.css';
import '../css/play.css';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
const io = require('socket.io-client');
//import Websocket from 'react-websocket';

class PlayerDisplay extends React.Component {
    static defaultProps = {
        id: 0
    }
    
    render() {
        return (
            <Container className="player">
                <Container className="player-info">
                    <Row className="player-info-row">Player {this.props.id}</Row>
                    <Row className="player-info-row">2000</Row>
                </Container>
            </Container>
        )
    }
}

class PotDisplay extends React.Component {
    static defaultProps = {
        potValue: 0
    }

    render() {
        return (
            <Container className="pot player">
                <Row className="player-info-row">Pot: {this.props.potValue}</Row>
            </Container>
        )
    }
}

class GameWindow extends React.Component {

    render() {
        return (
            <Container className="game-window">
                <Row><PlayerDisplay id={0}/><PlayerDisplay id={1}/></Row>
                <Row className="spacer" style={{height: '100px'}}></Row>
                <Row style={{height: '50px', margin: 'auto'}}>
                    <PotDisplay />
                </Row>
                <Row className="spacer" style={{height: '100px'}}></Row>
                <Row><PlayerDisplay id={2}/><PlayerDisplay id={3}/></Row>
            </Container>
        )
    }
}

class TaskBar extends React.Component {
    render() {
        return (
            <Container className="task-bar">
                <Row>
                    <Information />
                    <InputDisplay />
                </Row>
            </Container>
        )
    }
}

class Information extends React.Component {
    render() {
        return (
            <Container className="information">
                Information will go here.
            </Container>
        )
    }
}

class InputDisplay extends React.Component {
    static defaultProps = {
        gameID: "game12"
    }
    sendAction(action) {
        var accessToken = sessionStorage.getItem("token");
        var username = sessionStorage.getItem("username");
        var postURL = `https://0.0.0.0:3000/api/game/${this.props.gameID}`

        const requestOptions = {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify({ message: action })
        };
        
        fetch(postURL, requestOptions)
            .then(response => response)
            .then(data => {
                console.log(data)
            })
    }
    onFold(e) {
        //var exampleSocket = new WebSocket("wss://0.0.0.0:3000/testing", "echo-protocol");
        //exampleSocket.onmessage = function(msg) {console.log("OPEN")};

        this.sendAction("FOLD");
    }
    onCheck(e) {
        this.sendAction("CHECK");
    }
    onCall(e) {
        this.sendAction("CALL");
    }
    render() {
        return (
            <Container className="input-display">
                <Row>
                    <Button onClick={this.onFold.bind(this)} className="button" variant="primary" type="button">Fold</Button>
                    <Button onClick={this.onCheck.bind(this)} className="button" variant="warning" type="button">Check</Button>
                    <Button onClick={this.onCall.bind(this)} className="button" variant="info" type="button">Call</Button>
                </Row>
            </Container>
        )
    }
}
export default class Play extends React.Component {
    static defaultProps = {
        gameID: "game12"
    }
    state = {
        count: 90
    }
    handleData(data) {
        console.log('handledata')
        //console.log(data.message);
        //this.setState({count: this.state.count + 1});
    }
    render() {
        return (
            <Container className="Play">
                Count: <strong>{this.state.count}</strong>
                {/* <Websocket url={"ws://0.0.0.0:3000/testing"}
                    onMessage={this.handleData.bind(this)}
                    onOpen={(d) => console.log('open')}
                    onClose={(d) => console.log('close')}
                    debug={true}/> */}
                <PrimaryNavbar />
                <Col>
                    <GameWindow />
                    <TaskBar />
                </Col>
            </Container>
        )
    }
}

ReactDOM.render(<Play />, document.getElementById('play'));