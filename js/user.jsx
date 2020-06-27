import React from 'react';
import ReactDOM from 'react-dom';


class User extends React.Component {
    render() {
        return (
            <div>
                <h1>User</h1>
            </div>
        );
    }
}

ReactDOM.render(<User />, document.getElementById('user'));
