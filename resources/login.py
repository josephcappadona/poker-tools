from flask import render_template, make_response, request
from flask_restful import Resource
from security import authenticate
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required


class LoginResource(Resource):
    def post(self):
        if not request.is_json:
            return {
                'message': 'Invalid request, content-type is not JSON',
                'success': False
            }, 400

        username = request.json.get('username')
        password = request.json.get('password')
        if not username:
            return {
                'message': 'Invalid request, no username specified',
                'success': False
            }, 400
        if not password:
            return {
                'message': 'Invalid request, no password specified',
                'success': False
            }, 400
        user = authenticate(username, password)
        if user:
            access_token = create_access_token(identity=user.username)
            return {
                'accessToken': access_token,
                "message": "Logged in",
                "success": True
            }, 200
        else:
            return {
                'message': 'Invalid username/password',
                'success': False,
            }, 401

class LoginPage(Resource):
    def get(self):
        user = get_jwt_identity()
        if user is None:
            html = render_template('login.html')
        else:
            html = render_template('home.html')
        response = make_response(html)
        response.headers['content-type'] = 'text/html'
        return response