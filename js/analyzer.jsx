import React from 'react';
import ReactDOM from 'react-dom';
import PrimaryNavbar from './components/navbar.jsx';

import Container from 'react-bootstrap/Container';
import RangeAnalyzer from './components/RangeAnalyzer/RangeAnalyzer.jsx';

import '../css/bootstrap.css';
import '../css/rangeslider.min.css';
import '../css/rejam.css';

const axios = require('axios').default;

class Analyzer extends React.Component {
    static defaultProps = {}

    state = {}

    render() {
        return (
            <Container className="Analyzer">
                <PrimaryNavbar />
                <Container className="analyzer">
                    <h1>Range Analyzer</h1>
                    <RangeAnalyzer />
                </Container>
            </Container>
        )
    }
}

ReactDOM.render(<Analyzer />, document.getElementById('analyzer'));