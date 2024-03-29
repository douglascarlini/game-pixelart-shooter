class Item {

    constructor(conf = {}) {

        this.spr = { img: new Image(), len: 0, rep: true, die: false, num: 0, w: 32, h: 32 };
        this.att = { alpha: 100, glow: { siz: 3, rgb: '#fff' }, gco: 'source-over' };
        this.vel = { x: 0, y: 0, r: 0, f: 0.89, a: 1 };
        this.pos = { x: 0, y: 0, z: 1, r: 0 };
        this.siz = { w: 32, h: 32 };
        this.uid = ++Game.uid;
        this.aim = false;
        this.cat = 'x';
        this.aux = {};

        this.load(conf);

        this.siz.w = this.siz.w * Game.scale;
        this.siz.h = this.siz.h * Game.scale;

    }

    load(conf = {}) {
        for (let i in conf) {
            if (typeof conf[i] != 'object') { this[i] = conf[i]; }
            else if (i != 'img') { for (let j in conf[i]) { this[i][j] = conf[i][j]; } }
        }
    }

    update() {

        this.spr.num = ((this.spr.num < this.spr.len) ? (this.spr.num + 1) : (this.spr.rep ? 0 : this.spr.num));
        if (!this.spr.rep && this.spr.num == this.spr.len && this.spr.die) delete Game.items[this.uid];
        if (this.att.alpha < 0.1) delete Game.items[this.uid];

        this.move();

    }

    move() {

        if (this.aim) {

            this.vel.a *= this.vel.f;

            if (this.aim.pos)

                this.pos.r = Calc.rot(this.pos.x, this.pos.y, this.aim.pos.x, this.aim.pos.y);

            this.vel.x = Math.cos(Calc.deg(this.pos.r)) * this.vel.a;
            this.vel.y = Math.sin(Calc.deg(this.pos.r)) * this.vel.a;

        } else {

            this.vel.x *= this.vel.f;
            this.vel.y *= this.vel.f;
            this.vel.r *= this.vel.f;

        }

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.pos.r += this.vel.r;

    }

    collide() {

    }

    custom() { }

};