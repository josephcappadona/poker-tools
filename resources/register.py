from flask import render_template, make_response
from flask_restful import Resource, reqparse
from models.user import UserModel


class RegisterResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('username',
                        type=str,
                        required=True,
                        help="This field cannot be blank.")
    parser.add_argument('password',
                        type=str,
                        required=True,
                        help="This field cannot be blank.")

    def post(self):
        data = RegisterResource.parser.parse_args()

        if UserModel.find_by_username(data['username']):
            return {"message": "A user with that username already exists"}, 400

        user = UserModel(data['username'], data['password'])
        user.save_to_db()

        return {"message": "User created successfully."}, 201

class RegisterPage(Resource):
    def get(self):
        response = make_response(render_template('register.html'))
        response.headers['content-type'] = 'text/html'
        return response