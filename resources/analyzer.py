from flask import make_response, render_template, request
from flask_restful import Resource
from munch import Munch
from .poker_utils import getStatistics, matrixToRange
import json


class AnalyzerPage(Resource):
    def get(self):
        response = make_response(render_template('analyzer.html'))
        response.headers['content-type'] = 'text/html'
        return response

class AnalyzerResource(Resource):
    def post(self):
        if not request.is_json:
            return {
                'message': 'Invalid request, content-type is not JSON',
                'success': False
            }, 400
        data = request.json
        return {
            'message': 'successful post',
            'success': True,
            'data': self.compute_statistics(data)
        }, 200

    @staticmethod
    def compute_statistics(params):
        """
        Input `params` contains:
            * range
            * board
            * toggles

        Returns
            * message
            * success
            * data
        """
        d = Munch(params)
        range = matrixToRange(json.loads(d.range))
        stats, sumStats, sumStat, nCombos = getStatistics(range, d.board, d.toggles)
        return {
            'message': 'successful post',
            'success': True,
            'data': {
                'statistics': stats,
                'summaryStatistics': sumStats,
                'summaryStatistic': sumStat,
                'nCombos': nCombos,
            }
        }