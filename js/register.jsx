import React from 'react';
import ReactDOM from 'react-dom';


class SignUp extends React.Component {
    render() {
        return (
            <div>
                <h1>Create an Account</h1>
            </div>
        );
    }
}

ReactDOM.render(<SignUp />, document.getElementById('register'));
