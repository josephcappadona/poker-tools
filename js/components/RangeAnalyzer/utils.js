const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
export const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);
export const ranks = "AKQJT98765432";
const ranksCmp = function (a, b) {
    if (ranks.indexOf(a) < ranks.indexOf(b)) return -1;
    if (ranks.indexOf(a) > ranks.indexOf(b)) return 1;
    return 0;
}
export const suits = "hcds";
export const cards = cartesian(ranks.split(''), suits.split('')).map((e) => e.join(''));
export const hands = cartesian(ranks.split(''), ranks.split(''))
    .map(function (e, i) {
        var x = i % 13;
        var y = Math.trunc(i / 13);
        var s = e.sort(ranksCmp).join('');
        if (x > y) {
            s += 's';
        } else if (x < y) {
            s += 'o';
        }
        return s;
    });


Object.defineProperty(String.prototype, 'hashCode', {
    value: function () {
        var hash = 0, i, chr;
        for (i = 0; i < this.length; i++) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
});

class GeneralSet {

    constructor(hash_fn) {
        this.map = new Map();
        this.hash_fn = hash_fn;
        this[Symbol.iterator] = this.values;
    }

    add(item) {
        this.map.set(this.hash_fn(item), item);
    }

    values() {
        return this.map.values();
    }

    delete(item) {
        return this.map.delete(this.hash_fn(item));
    }

    has(item) {
        return this.map.has(this.hash_fn(item));
    }
}


var hashArray = function (arr) {
    var s = 0;
    for (var i = 0; i < arr.length; i++) {
        s += arr[i].toString().hashCode()*(i+1);
    };
    return s;
}

export var enumerateCombosInRange = function (range) {

    var hands = new GeneralSet(hashArray);
    var i;
    for (var i = 0; i < range.length; i++) {
        var combo = range[i];
        var card1, card2, hand;

        if (combo.length <= 3) {
            card1 = combo[0];
            card2 = combo[1];
            var modifier = combo.length == 3 ? combo[2] : "";
            if (card1 === card2) {
                // combo is pair
                for (var j = 0; j < suits.length; j++) {
                    for (var k = j + 1; k < suits.length; k++) {
                        hand = [card1 + suits[j], card2 + suits[k]];
                        hands.add(hand);
                    }
                }
            } else if (modifier === "s") {
                // combo is suited
                for (var j = 0; j < suits.length; j++) {
                    hand = [card1 + suits[j], card2 + suits[j]];
                    hands.add(hand);
                }
            } else if (modifier === "o") {
                // combo is offsuit
                for (var j = 0; j < suits.length; j++) {
                    for (var k = 0; k < suits.length; k++) {
                        if (j !== k) {
                            hand = [card1 + suits[j], card2 + suits[k]];
                            hands.add(hand);
                        }
                    }
                }
            } else {
                // combo is both offuit and suited
                for (var j = 0; j < suits.length; j++) {
                    for (var k = 0; k < suits.length; k++) {
                        var hand = [card1 + suits[j], card2 + suits[k]];
                        hands.add(hand);
                    }
                }
            }

        } else {
            card1 = combo.slice(0, 2);
            card2 = combo.slice(2, 4);
            hands.add(hand);
        }
    }
    return [...hands.values()];
}

export const convertRangeToHands = function(r) {
    var res = [];
    var i,j;
    for (i=0; i < 13; i++) {
        for (j=0; j < 13; j++) {
            if (r[i*13 + j] > 0) {
                res.push(hands[i*13 + j]);
            }
        }
    }
    return res;
}

class DefaultDict {
    constructor(defaultVal) {
      return new Proxy({}, {
        get: (target, name) => name in target ? target[name] : defaultVal
      })
    }
  }
  

export const madeHandTypes = [
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

export const drawTypes = [
    "flush draw",
    "OESD",
    "gutshot",
    "overcards",
    'BDSD',
]

export const comboDrawTypes = [
    'FD+Pair',
    'FD+OESD',
    'FD+gutshot',
    'OESD+Pair',
    'gutshot+Pair',
    'BDFD+BDSD',
]