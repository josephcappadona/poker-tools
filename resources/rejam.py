from flask import make_response, render_template, request
from flask_restful import Resource
from munch import Munch


class RejamCalculatorPage(Resource):
    def get(self):
        response = make_response(render_template('rejam.html'))
        response.headers['content-type'] = 'text/html'
        return response

class RejamResource(Resource):
    def post(self):
        if not request.is_json:
            return {
                'message': 'Invalid request, content-type is not JSON',
                'success': False
            }, 400
        data = request.json
        stats = self.compute_statistics(data)
        return {
            'message': 'successful post',
            'success': True,
            'data': stats
        }, 200

    @staticmethod
    def compute_statistics(params):
        """
        Input `params` contains:
            * effective_stack
            * total_antes
            * open_size
            * villain_pfr
            * villain_call
            * equity_when_called
            * still_to_act
            * behind_call
            * equity_vs_behind

        Returns
            * prob_villain_call
            * prob_behind_call
            * prob_all_fold
            * EV_villain_call
            * EV_behind_call
            * EV_all_fold
            * EV_total
        """
        d = Munch(params)

        blind_discount = 0
        if d.still_to_act == 0:
            blind_discount = 1
        elif d.still_to_act == 1:
            blind_discount = 0.5
        total_pot_when_called = (1.5 - blind_discount) + d.total_antes + 2 * d.effective_stack
        
        prob_villain_call = d.villain_call / d.villain_pfr
        prob_villain_fold = 1 - prob_villain_call
        EV_villain_call = d.equity_when_called * total_pot_when_called - (1 - d.equity_when_called) * d.effective_stack
        
        prob_all_folds_behind = (1 - d.behind_call) ** d.still_to_act
        prob_behind_call = 1 - prob_all_folds_behind
        EV_behind_call = d.equity_vs_behind * total_pot_when_called - (1 - d.equity_vs_behind) * d.effective_stack

        prob_all_fold = prob_villain_fold * prob_all_folds_behind
        EV_all_fold = (1.5 - blind_discount) + d.total_antes + d.open_size

        EV_total = prob_villain_call * EV_villain_call + \
                    prob_behind_call * EV_behind_call + \
                    + prob_all_fold * EV_all_fold
        return {
            'prob_villain_call': prob_villain_call,
            'prob_behind_call': prob_behind_call,
            'prob_all_fold': prob_all_fold,
            'EV_villain_call': EV_villain_call,
            'EV_behind_call': EV_behind_call,
            'EV_all_fold': EV_all_fold,
            'EV_total': EV_total,
        }