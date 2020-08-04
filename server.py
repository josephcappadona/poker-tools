#!/usr/bin/env python

import os
from flask import Flask, render_template, request, abort, jsonify, redirect, url_for
from flask_restful import Resource, Api
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_socketio import SocketIO, emit

from security import authenticate, identity
from resources.home import HomePage
from resources.user import UserResource, UserPage, UserPasswordResource, UserDeleteResource
from resources.register import RegisterResource, RegisterPage
from resources.login import LoginResource, LoginPage
from resources.settings import SettingsResource, SettingsPage
from resources.play import PlayPage, GameResource
from resources.rejam import RejamCalculatorPage, RejamResource

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PROPAGATE_EXCEPTIONS'] = True
api = Api(app)

app.config['JWT_SECRET_KEY'] = 'jwt-secret-key'
jwt = JWTManager(app)

app.config['SECRET_KEY'] = 'secret-key'
socketio = SocketIO(app)
# https://blog.miguelgrinberg.com/post/easy-websockets-with-flask-and-gevent


@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/')
def index():
    return redirect(url_for('homepage'))

@app.route('/logout')
def logout():
    return redirect(url_for('homepage'))

api.add_resource(HomePage, '/home')
api.add_resource(LoginPage, '/login')
api.add_resource(RegisterPage, '/register')
api.add_resource(SettingsPage, '/settings')
api.add_resource(PlayPage, '/play')
api.add_resource(RejamCalculatorPage, '/rejam')
api.add_resource(RejamResource, '/api/rejam')
api.add_resource(GameResource, '/api/game/<string:game_id>')

api.add_resource(LoginResource, '/api/login')
api.add_resource(RegisterResource, '/api/register')
api.add_resource(UserResource, '/api/user/<string:username>')
api.add_resource(SettingsResource, '/api/settings')
api.add_resource(UserDeleteResource, '/api/settings/delete/<string:username>')
api.add_resource(UserPasswordResource, '/api/user/password/<string:username>')


# from flask_socketio import SocketIO, Namespace, emit, disconnect, join_room, rooms, leave_room, close_room 
# class WebChat(Namespace):
#     def on_connect(self):
#         print("connect")
#     def on_disconnect(self):
#         print("disconnect")
        
# socketio.on_namespace(WebChat('/testing'))

#socket.emit('fold', {message: 'Player 3 folded.'})
import ssl

ssl_context = ssl.SSLContext()
ssl_context.load_cert_chain('cert.pem', 'key.pem')

if __name__ == "__main__":
    from db import db
    db.init_app(app)
    socketio.run(
        app,
        host='0.0.0.0',
        port=3000,
        ssl_context=ssl_context,
        debug=True
    )
