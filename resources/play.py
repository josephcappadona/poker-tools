from flask import make_response, render_template, request
from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import UserModel

class PlayPage(Resource):
    def get(self):
        response = make_response(render_template('play.html'))
        response.headers['content-type'] = 'text/html'
        return response

game = {'actions':['a', 'b', 'c']}
class GameResource(Resource):
    def get(self, game_id):
        return game, 200
    
    @jwt_required
    def put(self, game_id):
        if not request.is_json:
            return {
                'message': 'Invalid request, content-type is not JSON',
                'success': False
            }, 400
        try:
            user = UserModel.find_by_username(get_jwt_identity())
        except Exception as e:
            print(e)
        print(user.username, game_id, request.json)
        return {
            'message': 'successful post',
            'success': True,
        }, 200