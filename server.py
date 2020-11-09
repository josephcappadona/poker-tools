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
from resources.rejam import RejamPage, RejamResource
from resources.analyzer import AnalyzerPage, AnalyzerResource

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PROPAGATE_EXCEPTIONS'] = True

app.config['JWT_SECRET_KEY'] = 'jwt-secret-key'
app.config['SECRET_KEY'] = 'secret-key'

api = Api(app)
jwt = JWTManager(app)


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
api.add_resource(RejamPage, '/rejam')
api.add_resource(AnalyzerPage, '/analyzer')

api.add_resource(RejamResource, '/api/rejam')
api.add_resource(AnalyzerResource, '/api/analyzer')
api.add_resource(GameResource, '/api/game/<string:game_id>')

api.add_resource(LoginResource, '/api/login')
api.add_resource(RegisterResource, '/api/register')
api.add_resource(UserResource, '/api/user/<string:username>')
api.add_resource(SettingsResource, '/api/settings')
api.add_resource(UserDeleteResource, '/api/settings/delete/<string:username>')
api.add_resource(UserPasswordResource, '/api/user/password/<string:username>')


if __name__ == "__main__":
    from db import db
    db.init_app(app)
    app.run(
        host='0.0.0.0',
        port=3000,
        ssl_context='adhoc',
        debug=True
    )
