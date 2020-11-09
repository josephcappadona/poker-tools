import React from 'react';
import ReactDOM from 'react-dom';

import Container from 'react-bootstrap/Container';


class User extends React.Component {
    render() {
        return (
            <Container>
                <h1>User</h1>
            </Container>
        );
    }
}

ReactDOM.render(<User />, document.getElementById('user'));
