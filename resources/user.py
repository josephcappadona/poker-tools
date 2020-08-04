from flask import make_response, render_template
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import UserModel


class UserResource(Resource):

    def get(self, username):
        if not username:
            return {"msg": "No user specified"}, 400
        user = next((u for u in users if u.username == username), None)
        if user is not None:
            return user.json(), 200
        else:
            return {"msg": "User not found"}, 404

class UserPasswordResource(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('password', type=str)
    parser.add_argument('passwordConfirmation', type=str)

    @jwt_required
    def put(self, username):
        data = UserPasswordResource.parser.parse_args()
        user = UserModel.find_by_username(get_jwt_identity())
        if username == user.username:
            if not data.password or not data.passwordConfirmation:
                return {
                    'message': "Missing required fields",
                    'success': False
                }, 400
            if data.password == data.passwordConfirmation:
                user.password = data['password']
                user.save_to_db()
                return {
                    'message': "Password updated",
                    'success': True
                }, 200
            else:
                return {
                    'message': "Passwords don't match",
                    'success': False
                }, 400
        return {
            'message': "Malformed request",
            'success': False
        }, 400

class UserDeleteResource(Resource):
    @jwt_required
    def delete(self, username):
        user = UserModel.find_by_username(get_jwt_identity())
        if user:
            user.delete_from_db()
            return {
                'message': "Account deleted",
                'success': True
            }, 200
        else:
            return {
                'message': "User does not exist",
                'success': False
            }, 400


class UserPage(Resource):
    def get(self, username):
        response = make_response(render_template('user.html'))
        response.headers['content-type'] = 'text/html'
        return response