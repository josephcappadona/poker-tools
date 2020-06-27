from flask import make_response, render_template
from flask_restful import Resource


class UserResource(Resource):

    def get(self, username):
        if not username:
            return {"msg": "No user specified"}, 400
        user = next((u for u in users if u.username == username), None)
        if user is not None:
            return user.json(), 200
        else:
            return {"msg": "User not found"}, 404

class UserPage(Resource):
    def get(self, username):
        response = make_response(render_template('user.html'))
        response.headers['content-type'] = 'text/html'
        return response