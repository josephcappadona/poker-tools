import React from 'react';
import ReactDOM from 'react-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PrimaryNavbar from './components/navbar.jsx';
import '../css/bootstrap.css';
import '../css/settings.css';
const io = require('socket.io-client');

const loadSettings = () =>
  fetch("https://0.0.0.0:3000/api/settings")
    .then(res => (res.ok ? res : Promise.reject(res)))
    .then(res => res.json())

class Settings extends React.Component {

    static defaultProps = {
        onSave: function(s) { },
    }

    state = {
        passwordResponseText: "",
        deleteResponseText: "",
        otherSettings: "",
    }

    componentDidMount() {
        var token = sessionStorage.getItem('token');

        const requestOptions = {
            method: 'GET',
            headers: (token !== null) ? { 'Authorization': 'Bearer ' + token } : {},
        };
        const response = fetch("https://0.0.0.0:3000/api/settings", requestOptions)
            .then(response => response.json())
            .then(function(data) {

                // do something with the settings data
                this.setState({
                    otherSettings: JSON.stringify(data.data)
                });
            }.bind(this));
    }

    handlePasswordSave(e) {
        e.preventDefault()

        let password = this.refs.password.value
        let passwordConfirmation = this.refs.passwordConfirmation.value
        
        var token = sessionStorage.getItem('token');
        var username = sessionStorage.getItem('username');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        const requestOptions = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ password, passwordConfirmation })
        };
        fetch(`https://0.0.0.0:3000/api/user/password/${username}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({passwordResponseText: data.message});
                if (data.success) {
                    sessionStorage.clear();
                }
            })
    }

    handleDeleteAccount(e) {
        e.preventDefault()
        var token = sessionStorage.getItem('token');
        var username = sessionStorage.getItem('username');
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
        const requestOptions = {
            method: 'DELETE',
            headers: headers,
        };
        fetch(`https://0.0.0.0:3000/api/settings/delete/${username}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({deleteResponseText: data.message});
                if (data.success) {
                    sessionStorage.clear()
                    window.location.href = "https://0.0.0.0:3000/home"
                }
            })
    }

    render() {
        return (
            <div className="Settings">
                <PrimaryNavbar />
                <h1>Settings</h1>
                <h2>Other Settings</h2>
                {this.state.otherSettings}
                <h2>Security</h2>
                <h3>Change Password</h3>
                <Form className="Form" onSubmit={this.handlePasswordSave.bind(this)}>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label className="form-label">Password</Form.Label>
                        <Form.Control className="form-control" type="password" ref="password"/>
                        <Form.Label className="form-label">Confirm Password</Form.Label>
                        <Form.Control className="form-control" type="password" ref="passwordConfirmation"/>
                    </Form.Group>
                    <div className="row">
                        <Button
                            className="button"
                            variant="primary"
                            type="submit"
                            disabled={this.refs.password === "" || this.refs.passwordConfirmation === ""}
                        >
                            Save
                        </Button>
                        <div className="">{this.state.passwordResponseText}</div>
                    </div>
                </Form>
                <h3>Delete Account</h3>
                <div className="row">
                    <Button
                        className="button"
                        variant="danger"
                        onClick={this.handleDeleteAccount.bind(this)}
                    >
                        Delete Account
                    </Button>
                    <div className="">{this.state.deleteResponseText}</div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Settings />, document.getElementById('settings'));
