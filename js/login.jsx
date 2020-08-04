import React from "react";
import ReactDOM from 'react-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import PrimaryNavbar from './components/navbar.jsx';
import '../css/bootstrap.css';
import '../css/login.css';

export default class Login extends React.Component {

    state = {
        email: "",
        password: "",
        responsetext: ""
    }
  
    validateForm(u, p) {
        return u.length > 0 && p.length > 0;
    }
  
    handleSignIn(e) {
        e.preventDefault()

        let username = this.refs.username.value
        let password = this.refs.password.value

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        };
        fetch('https://0.0.0.0:3000/api/login', requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({responseText: data.message});
                if (data.success) {
                    sessionStorage.setItem('token', data.accessToken);
                    sessionStorage.setItem('username', username);
                    window.location.href = 'https://0.0.0.0:3000/home';
                }
            })
      }

    render() {
        return (
            <div className="Login">
                <PrimaryNavbar />
                <h1>Login</h1>
                <Form className="Form" onSubmit={this.handleSignIn.bind(this)}>
                    <Form.Group>
                        <Form.Label className="form-label">Username</Form.Label>
                        <Form.Control className="form-control" type="text" ref="username" placeholder="enter username"/>
                        <Form.Label className="form-label">Password</Form.Label>
                        <Form.Control className="form-control" type="password" ref="password" placeholder="enter password"/>
                    </Form.Group>
                    <div className="row">
                        <Button className="button" variant="primary" type="submit">
                            Log in
                        </Button>
                        <div className="">{this.state.responseText}</div>
                    </div>
                </Form>
            </div>
        );
    }
}

ReactDOM.render(<Login />, document.getElementById('login'));