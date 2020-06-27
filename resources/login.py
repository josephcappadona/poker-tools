from flask import render_template, make_response, request
from flask_restful import Resource
from security import authenticate
from flask_jwt_extended import create_access_token, get_jwt_identity


class LoginResource(Resource):
    def post(self):
        if not request.is_json:
            return {'msg': 'Invalid request, content-type is not JSON'}, 400

        username = request.json.get('username')
        password = request.json.get('password')
        if not username:
            return {'msg': 'Invalid request, no username specified'}, 400
        if not password:
            return {'msg': 'Invalid request, no password specified'}, 400
        user = authenticate(username, password)
        if user:
            access_token = create_access_token(identity=user.username)
            print(f"{user.username} logged in")
            return {'access_token': access_token}, 200
        else:
            return {'msg': 'Invalid username/password'}, 401

class LoginPage(Resource):
    def get(self):
        user = get_jwt_identity()
        if user is None:
            html = render_template('login.html')
        else:
            html = render_template('index.html')
        response = make_response(html)
        response.headers['content-type'] = 'text/html'
        return response