class Calc {

    static rnd(max, min = 0, int = false) {
        var val = min + Math.random() * max;
        return int ? Math.round(val) : val;
    }

    static deg(rad) { return rad * Math.PI / 180; }

    static orb(px, py, pr, dd) {

        var r = Calc.deg(pr);

        var x = px + dd * Math.cos(r);
        var y = py + dd * Math.sin(r);

        return { x, y };
    }

    static dst(x1, y1, x2, y2) {

        var dx = x1 - x2;
        var dy = y1 - y2;

        var dd = Math.sqrt((dx * dx) + (dy * dy));

        return { dx, dy, dd };

    }

    static rot(x1, y1, x2, y2) {

        var { dx, dy } = Calc.dst(x1, y1, x2, y2);

        return -Math.atan2(dy, dx);

    }

};