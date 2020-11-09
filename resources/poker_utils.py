from poker.hand import Range
from itertools import product
import numpy as np
from typing import Iterable
from munch import Munch
from copy import deepcopy

ranks = list("AKQJT98765432")
suits = list("♠♥♣♦")
suitToLetter = dict(zip(suits, list("shcd")))
def sanitizeCard(c):
    r, s = c
    if s in suits:
        return r + suitToLetter[s]
    else:
        return c
cards = [r+s for r, s in product(ranks, suits)]

madeHandTypes = [
    "Straight Flush",
    "Quads",
    "Full House",
    "Flush",
    "Straight",
    "Trips",
    "Two Pair",
    "Pair",
    "High Card"
]
madeHandStatsDefault = {handType: 0 for handType in madeHandTypes}

drawTypes = [
    "flush draw",
    "OESD",
    "gutshot",
    "overcards",
    "BDSD",
]
drawStatsDefault = {handType: 0 for handType in drawTypes}

comboDrawTypes = [
    "FD+Pair",
    "FD+OESD",
    "FD+gutshot",
    "OESD+Pair",
    "gutshot+Pair",
    "BDFD+BDSD",
]
comboDrawStatsDefault = {handType: 0 for handType in comboDrawTypes}

emptyStats = {
    "madeHandStats": madeHandStatsDefault.copy(),
    "drawStats": drawStatsDefault.copy(),
    "comboDrawStats": comboDrawStatsDefault.copy()
}
emptyToggles = emptyStats.copy()

class Hand:
    def __init__(self, c1, c2):
        self.cards = set([c1, c2])
        self.c1 = c1
        self.c2 = c2
    def __eq__(self, other):
        return self.cards == other.cards
    def __hash__(self):
        return hash(self.c1) ^ hash(self.c2)
    def __str__(self):
        return "".join(sorted(self.cards, key=lambda x: cards.index(x)))

def matrixToRange(matrix):
    range_ = set()
    for i, r1 in enumerate(ranks):
        for j, r2 in enumerate(ranks):
            if matrix[i][j] > 0:
                if i == j:
                    modifier = ""
                elif i < j:
                    modifier = "s"
                elif i > j:
                    modifier = "o"
                hand = r1 + r2 + modifier
                combos = Range(hand).combos
                for combo in combos:
                    range_.add(str(combo))
    return Range(" ".join(range_))

def rangeToMatrix(range):
    if isinstance(range, Iterable):
        range = Range(" ".join(range))
    matrix = np.zeros((13, 13))
    hands = []
    for i, r1 in enumerate(ranks):
        for j, r2 in enumerate(ranks):
            if i == j:
                modifier = ""
            elif i < j:
                modifier = "s"
            elif i > j:
                modifier = "o"
            hand = r1 + r2 + modifier
            combos = Range(hand).combos
            all_ = True
            for combo in combos:
                if combo not in range:
                    all_ = False
                    break
            if all_:
                matrix[i, j] = 1
    return matrix


import eval7
from collections import Counter

OESDpatterns = {
    (False, True, True, True, True, False, False),
    (False, False, True, True, True, True, False),

    (True, False, True, True, True, False, True), # double gutter
}
GSSDpatterns = {
    (True, True, True, True, False, False, False),
    (False, False, False, True, True, True, True),

    (True, True, True, False, True, False, False),
    (False, True, True, True, False, True, False),
    (False, False, True, True, True, False, True),

    (True, True, False, True, True, False, False),
    (False, True, True, False, True, True, False),
    (False, False, True, True, False, True, True),

    (True, False, True, True, True, False, False),
    (False, True, False, True, True, True, False),
    (False, False, True, False, True, True, True)
}
BDSDpatterns = {
    (True, True, True, False, False, False, False),
    (False, True, True, True, False, False, False),
    (False, False, True, True, True, False, False),
    (False, False, False, True, True, True, False),
    (False, False, False, False, True, True, True),

    (True, True, False, True, False, False, False),
    (False, True, True, False, True, False, False),
    (False, False, True, True, False, True, False),
    (False, False, False, True, True, False, True),

    (True, False, True, True, False, False, False),
    (False, True, False, True, True, False, False),
    (False, False, True, False, True, True, False),
    (False, False, False, True, False, True, True),

    (True, True, False, False, True, False, False),
    (False, True, True, False, False, True, False),
    (False, False, True, True, False, False, True),

    (True, False, False, True, True, False, False),
    (False, True, False, False, True, True, False),
    (False, False, True, False, False, True, True),

    (True, False, True, False, True, False, False),
    (False, True, False, True, False, True, False),
    (False, False, True, False, True, False, True),
}
def straightDraws(handRanks):
    extendedRanks = ranks + ["A"]
    bools = [r in handRanks for r in extendedRanks]
    isOESD = False
    isGSSD = False
    isBDSD = False
    for i in range(len(extendedRanks)-6):
        window = tuple(bools[i:i+7])
        isOESD = isOESD or window in OESDpatterns
        isGSSD = isGSSD or window in GSSDpatterns
        isBDSD = isBDSD or window in BDSDpatterns
    return isOESD, isGSSD, isBDSD

def flushDraws(suitCounts):
    isFD = False
    isBDFD = False

    maxSuitCount = max(suitCounts.values())
    if maxSuitCount == 4:
        isFD = True
    elif maxSuitCount == 3:
        isBDFD = True
    return isFD, isBDFD

def overcards(cards, board):
    nOvercards = 0
    for c in cards:
        r_c, _ = c
        allOver = all(ranks.index(r_c) < ranks.index(r_b) for r_b, _ in board)
        if allOver:
            nOvercards += 1
    return nOvercards == 2

def handTypes(cards, board):

    hand = [eval7.Card(c) for c in cards + board]
    madeHand = eval7.handtype(eval7.evaluate(hand))

    handRanks, handSuits = zip(*(cards + board))
    handRanks = set(handRanks)
    suitCounts = Counter(handSuits)

    isOESD, isGSSD, isBDSD = straightDraws(handRanks)
    isFD, isBDFD = flushDraws(suitCounts)
    isOvercards = overcards(cards, board)

    draws = set()
    comboDraws = set()

    if isOvercards:
        draws.add('overcards')

    # if made hand is worse than a flush
    if madeHandTypes.index(madeHand) > madeHandTypes.index('Flush'):
        if isFD:
            draws.add('flush draw')
            if madeHand == 'Pair':
                comboDraws.add('FD+Pair')
            if isOESD:
                comboDraws.add('FD+OESD')
            elif isGSSD:
                comboDraws.add('FD+gutshot')
        elif isBDFD:
            if isBDSD:
                comboDraws.add('BDFD+BDSD')

    # if made hand is worse than a straight
    if madeHandTypes.index(madeHand) > madeHandTypes.index('Straight'):
        if isOESD:
            draws.add('OESD')
            if madeHand == 'Pair':
                comboDraws.add('OESD+Pair')
        elif isGSSD:
            draws.add('gutshot')
            if madeHand == 'Pair':
                comboDraws.add('gutshot+Pair')
        elif isBDSD:
            draws.add('BDSD')
            
    return madeHand, draws, comboDraws
    

def getStatistics(range, board, toggles):

    stats = Munch(deepcopy(emptyStats))
    toggles = Munch(toggles if toggles else deepcopy(emptyToggles))

    summaryStats = Munch({
        "madeHandStats": 0,
        "drawStats": 0,
        "comboDrawStats": 0,
    })
    summaryStat = 0
    sanitizedBoard = [sanitizeCard(c) for c in board]

    nCombos = len(range.combos)
    for combo in range.combos:
        # sanitize for pyeval7
        c1, c2 = sanitizeCard(str(combo.first)), sanitizeCard(str(combo.second))

        sanitizedCards = [c1, c2]

        # get stats for this combo
        madeHand, draws, comboDraws = handTypes(sanitizedCards, sanitizedBoard)
        includeInSummaryTotal = False

        stats.madeHandStats[madeHand] += 1
        if toggles.madeHandStats[madeHand] == 1:
            summaryStats.madeHandStats += 1
            includeInSummaryTotal = True

        for draw in draws:
            stats.drawStats[draw] += 1
        if any(toggles.drawStats[draw] == 1 for draw in draws):
            summaryStats.drawStats += 1
            includeInSummaryTotal = True

        for comboDraw in comboDraws:
            stats.comboDrawStats[comboDraw] += 1
        if any(toggles.comboDrawStats[comboDraw] == 1 for comboDraw in comboDraws):
            summaryStats.comboDrawStats += 1
            includeInSummaryTotal = True
        
        if includeInSummaryTotal:
            summaryStat += 1

    return stats, summaryStats, summaryStat, nCombos

# r = Range('AQs+ TT+')
# from pprint import pprint
# pprint(getStatistics(r, ['As', 'Ks', 'Qs'], None))
