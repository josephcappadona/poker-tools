import React from 'react';
import ReactDOM from 'react-dom';

import PrimaryNavbar from './components/navbar.jsx';

export default class HomePage extends React.Component {

    logout() {
        sessionStorage.setItem('token', null);
        sessionStorage.setItem('username', null);
    }
    
    render() {
        return (
            <div>
                <PrimaryNavbar />
                <p>{sessionStorage.getItem('token') ? "Logged in" : "Not logged in"}</p>
                <p>This website is very much under construction, but feel free to look around.</p>
            </div>
        );
    }
}

ReactDOM.render(<HomePage />, document.getElementById('home'));