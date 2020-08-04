from flask import render_template, make_response
from flask_restful import Resource, reqparse
from models.user import UserModel
from security import authenticate
from flask_jwt_extended import create_access_token


class RegisterResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('username', type=str)
    parser.add_argument('password', type=str)
    parser.add_argument('passwordConfirmation', type=str)

    def post(self):
        data = RegisterResource.parser.parse_args()

        missing = not data['username'] or not data['password'] or not data['passwordConfirmation']
        if missing:
            return {
                "message": "Missing required fields",
                "success": False
            }, 400

        if UserModel.find_by_username(data['username']):
            return {
                "message": "A user with that username already exists",
                "success": False
            }, 400

        if data['password'] == data['passwordConfirmation']:
            user = UserModel(data['username'], data['password'])
            user.save_to_db()

            access_token = create_access_token(identity=user.username)
            return {
                "accessToken": access_token,
                "message": "User created successfully",
                "success": True
            }, 200
        else:
            return {
                "message": "Passwords don't match",
                "success": False
            }, 400

class RegisterPage(Resource):
    def get(self):
        response = make_response(render_template('register.html'))
        response.headers['content-type'] = 'text/html'
        return response