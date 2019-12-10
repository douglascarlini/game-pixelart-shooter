class Make {

    static ship(s = 128) {

        var item = new Item({ pos: { y: (Game.h / 2), x: 50 }, siz: { w: s, h: s }, cat: 'ship', spr: { img: Game.img.ship, w: s, h: s } });

        item.custom = function () {

            var { x, y } = Calc.orb(this.pos.x, this.pos.y, this.pos.r + 175, this.siz.w / 2.3);

            if (this.vel.x > -1) Make.fire(x, y, this.vel.x, this.pos.r);
            if (Game.pad[39]) Make.fire(x, y, this.vel.x, this.pos.r);

            if (Game.pad[38]) this.vel.y -= this.vel.a;
            if (Game.pad[40]) this.vel.y += this.vel.a;
            if (Game.pad[37]) this.vel.x -= this.vel.a;
            if (Game.pad[39]) this.vel.x += this.vel.a;

            this.aux.shotCnt++;

            if (Game.pad[90] && this.aux.shotCnt > 5) {

                var a = 28, b = 20;

                var { x, y } = Calc.orb(this.pos.x, this.pos.y, this.pos.r + a, b);
                Make.shot(x, y, this.pos.r);
                Make.capsule(x, y);

                var { x, y } = Calc.orb(this.pos.x, this.pos.y, this.pos.r + a, b);
                var burst = Make.gunfire(x, y);

                this.aux.shotCnt = 0;
                Game.play('shot');

            }

            if (this.pos.x < this.siz.w / 2)
                this.vel.x += Math.random() * 10;

            this.pos.r = this.vel.y;

            var shake = 1;
            this.pos.x = this.pos.x + Calc.rnd((shake * 2), -shake, true);
            this.pos.y = this.pos.y + Calc.rnd((shake * 2), -shake, true);
        };

        Game.items[item.uid] = item;
        item.aux.shotCnt = 0;
        return item;

    }

    static shot(x, y, r, s = 27) {

        var item = new Item({ cat: 'shot', pos: { x, y }, siz: { w: s, h: s }, spr: { img: Game.img.shot, w: s, h: s } });

        item.att.glow.siz = 10;
        item.aim = true;
        item.vel.a = 20;
        item.pos.r = r;
        item.vel.f = 1;

        item.custom = function () {
            if (this.pos.x > Game.w) {
                delete Game.items[this.uid];
            }
        }

        Game.items[item.uid] = item;
        return item;

    }

    static fire(x, y, z, r, s = 18) {

        var u = 3;
        x = x + (-u + Math.random() * (u * 2)), y = y + (-u + Math.random() * (u * 2));

        var item = new Item({ cat: 'fire', pos: { x, y }, siz: { w: s, h: s }, spr: { img: Game.img.fire, len: 15, rep: false, die: true, w: s, h: s } });

        item.pos.z = 0.2 + z / 50 + Math.random() * 0.4;
        item.pos.r = -3 + r + Math.random() * 6;
        item.vel.a = -(Math.random() * 9.0);
        item.vel.x = -Calc.rnd(10);

        Game.items[item.uid] = item;
        return item;

    }

    static capsule(x, y, s = 18) {

        var item = new Item({ cat: 'capsule', pos: { x, y }, siz: { w: s, h: s }, spr: { img: Game.img.capsule, w: s, h: s } });

        item.custom = function () { this.vel.x -= 0.2; if (this.pos.x < 0) { delete Game.items[this.uid]; } }

        var nv = (v = 2) => -v + Math.random() * (v * 2);
        item.vel.r = -100 + Math.random() * 200;
        item.vel.f = 0.98;
        item.vel.x = nv();
        item.vel.y = nv();
        item.pad = true;

        Game.items[item.uid] = item;
        return item;

    }

    static gunfire(x, y, s = 36) {

        var item = new Item({ cat: 'gunfire', pos: { x, y }, siz: { w: s, h: s }, spr: { img: Game.img.gunfire, w: s, h: s } });

        item.custom = function () { this.att.alpha *= 0.8; }

        Game.items[item.uid] = item;

    }

    static star() {

        var item = new Item({ cat: 'star', spr: { img: Game.img.star } });

        item.reset = function (min = 0, add = 0) {

            var a = 0.3, b = 1.0, c = 5;
            this.pos.z = a + Math.random() * (b - a);
            this.pos.y = Math.random() * Game.h;
            this.att.alpha = this.pos.z * 80;
            this.pos.x = min + add;
            this.vel.x = -vel;
            this.vel.f = 1;

        }

        item.custom = function () {
            if (this.pos.x < 0) {
                this.reset(Game.w);
            }
        }

        item.reset(0, Calc.rnd(Game.w));

        Game.items[item.uid] = item;
        return item;

    }

};