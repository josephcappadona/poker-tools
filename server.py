#!/usr/bin/env python

import os
from flask import Flask, render_template, request, abort, jsonify
from flask_restful import Resource, Api
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    get_jwt_identity
)

from security import authenticate, identity
from resources.user import UserResource, UserPage
from resources.register import RegisterResource, RegisterPage
from resources.login import LoginResource, LoginPage


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['PROPAGATE_EXCEPTIONS'] = True
api = Api(app)

app.config['JWT_SECRET_KEY'] = 'secret-key'
jwt = JWTManager(app)

@app.before_first_request
def create_tables():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

api.add_resource(LoginPage, '/login')
api.add_resource(LoginResource, '/api/login')

api.add_resource(RegisterPage, '/register')
api.add_resource(RegisterResource, '/api/register')

api.add_resource(UserPage, '/user/<string:username>')
api.add_resource(UserResource, '/api/user/<string:username>')

if __name__ == "__main__":
    from db import db
    db.init_app(app)
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000), debug=True)
