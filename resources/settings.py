from flask import make_response, render_template, request
from flask_restful import Resource
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from collections import namedtuple
from models.user import UserModel



class SettingsResource(Resource):
    @jwt_required
    def post(self):
        if not request.is_json:
            return {
                'message': 'Invalid request, content-type is not JSON',
                'success': False
            }, 400
        user = UserModel.find_by_username(get_jwt_identity())
        return {
            'message': 'successful post',
            'success': True
        }, 200

    @jwt_required
    def get(self):
        user = UserModel.find_by_username(get_jwt_identity())
        return {
            'data': user.get_settings(),
            'success': True
        }, 200
        

class SettingsPage(Resource):
    def get(self):
        user = get_jwt_identity()
        if user is None:
            html = render_template('login.html')
        else:
            html = render_template('settings.html')
        response = make_response(html)
        response.headers['content-type'] = 'text/html'
        return response