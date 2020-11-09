import React from 'react';
import ReactDOM from 'react-dom';
import PrimaryNavbar from './components/navbar.jsx';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import '../css/register.css';
import '../css/bootstrap.css';

export default class Register extends React.Component {

    state = {
        email: "",
        password: "",
        passwordConfirmation: "",
        responsetext: ""
    }
  
    handleRegister(e) {
        e.preventDefault()
        let username = this.refs.username.value
        let password = this.refs.password.value
        let passwordConfirmation = this.refs.passwordConfirmation.value

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, passwordConfirmation })
        };
        fetch('https://0.0.0.0:3000/api/register', requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({responseText: data.message});
                if (data.success) {
                    sessionStorage.setItem('token', data.accessToken);
                    sessionStorage.setItem('username', data.username);
                    window.location.href = 'https://0.0.0.0:3000/home';
                }
            })
      }

    render() {
        return (
            <Container className="Register">
                <PrimaryNavbar />
                <h1>Register</h1>
                <Form className="Form" onSubmit={this.handleRegister.bind(this)}>
                    <Form.Group>
                        <Form.Label className="form-label">Username</Form.Label>
                        <Form.Control className="form-control" type="text" ref="username" placeholder="enter username"/>
                        <Form.Label className="form-label">Password</Form.Label>
                        <Form.Control className="form-control" type="password" ref="password" placeholder="enter password"/>
                        <Form.Label className="form-label">Password</Form.Label>
                        <Form.Control className="form-control" type="password" ref="passwordConfirmation" placeholder="confirm password"/>
                    </Form.Group>
                    <div>
                        <Button className="button" variant="primary" type="submit">
                            Register
                        </Button>
                        <div className="">{this.state.responseText}</div>
                    </div>
                </Form>
            </Container>
        );
    }
}

ReactDOM.render(<Register />, document.getElementById('register'));