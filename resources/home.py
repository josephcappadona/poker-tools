from flask import make_response, render_template
from flask_restful import Resource


class HomePage(Resource):
    def get(self):
        response = make_response(render_template('home.html'))
        response.headers['content-type'] = 'text/html'
        return response