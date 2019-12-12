class Make {

    static ship(s = 128) {

        var item = new Item({ pos: { y: (Game.h / 2), x: 50 }, siz: { w: s, h: s }, cat: 'ship', spr: { img: Game.img.ship, w: s, h: s } });

        item.custom = function () {

            var { x, y } = Calc.orb(this.pos.x, this.pos.y, this.pos.r + 175, this.siz.w / 2.3);

            if (this.vel.x > -1) Make.fire(x, y, this.vel.x, this.pos.r);
            if (Game.pad[39]) Make.fire(x, y, this.vel.x, this.pos.r);

            if (Game.dataset.inputs.length > 1000 && !Game.trained) {

                Game.train();

            } else if (!Game.trained) {

                this.pad.U = Game.pad[38];
                this.pad.D = Game.pad[40];
                this.pad.L = Game.pad[37];
                this.pad.R = Game.pad[39];
                this.pad.A = Game.pad[90];

                for (let uid in Game.items) {

                    var item = Game.items[uid];
                    if (item.cat != 'enemy1') continue;

                    var { dx, dy } = Calc.dst(this.pos.x, this.pos.y, item.pos.x, item.pos.y);
                    Game.dataset.inputs.push([dx, dy, item.pad.A]);

                    var U = this.pad.U ? 1 : 0;
                    var D = this.pad.D ? 1 : 0;
                    var L = this.pad.L ? 1 : 0;
                    var R = this.pad.R ? 1 : 0;
                    var A = this.pad.A ? 1 : 0;

                    Game.dataset.outputs.push([U, D, L, R, A]);
                    break;

                }

            } else if (Game.trained) {

                for (let uid in Game.items) {

                    var item = Game.items[uid];
                    if (item.cat != 'enemy1') continue;

                    var { dx, dy } = Calc.dst(this.pos.x, this.pos.y, item.pos.x, item.pos.y);

                    var o = Game.nn.predict([dx, dy, item.pad.A]);
                    console.log(o.map(n => n.toFixed(2)));

                    this.pad.U = (o[0] > 0.50);
                    this.pad.D = (o[1] > 0.50);
                    this.pad.L = (o[2] > 0.50);
                    this.pad.R = (o[3] > 0.50);
                    this.pad.A = (o[4] > 0.50);

                    console.log(this.pad);

                    break;

                }

            }


            this.aux.shotCnt++;

            if (this.pad.A && this.aux.shotCnt > 5) {

                var a = 28, b = 20;

                var { x, y } = Calc.orb(this.pos.x, this.pos.y, this.pos.r + a, b);
                Make.shot(x, y, this.pos.r, ['enemy1']);
                Make.capsule(x, y);

                var { x, y } = Calc.orb(this.pos.x, this.pos.y, this.pos.r + a, b);
                var burst = Make.gunfire(x, y, this.pos.r);

                this.aux.shotCnt = 0;
                Game.play('shot');

            }

            if (this.pos.x < 0)
                this.vel.x += 10;
            if (this.pos.x > Game.w)
                this.vel.x -= 10;
            if (this.pos.y < 0)
                this.vel.y += 10;
            if (this.pos.y > Game.h)
                this.vel.y -= 10;

            this.pos.r = this.vel.y;

            var shake = 1;
            this.pos.x = this.pos.x + Calc.rnd((shake * 2), -shake, true);
            this.pos.y = this.pos.y + Calc.rnd((shake * 2), -shake, true);

            var x = (this.pos.x - this.siz.w / 2) + Calc.rnd(this.siz.w / 2);
            var y = (this.pos.y - this.siz.h / 4) + Calc.rnd(this.siz.h / 2);
            Make.trail(x, y, this.vel.x, this.pos.r);

        };

        Game.items[item.uid] = item;
        item.aux.shotCnt = 0;
        return item;

    }

    static enemy1(s = 128) {

        var item = new Item({ pos: { y: (Game.h / 2), x: 500, r: 180 }, siz: { w: s, h: s }, cat: 'enemy1', spr: { img: Game.img.enemy1, w: s, h: s } });

        item.custom = function () {

            var { x, y } = Calc.orb(this.pos.x, this.pos.y, this.pos.r + 177, this.siz.w / 2.7);

            if (this.vel.x < 1) Make.fire(x, y, this.vel.x, this.pos.r);

            this.aux.shotCnt++;

            for (let uid in Game.items) {

                var item = Game.items[uid];
                if (item.cat != 'ship') continue;

                var { dx, dy } = Calc.dst(this.pos.x, this.pos.y, item.pos.x, item.pos.y);

                // if (Game.trained) {

                //     var o = Game.nn.predict([dx, dy, this.vel.x, this.vel.y, item.vel.x, item.vel.y, item.pad.A]);
                //     console.log(o);

                //     this.pad.U = (o[0] > 0.50);
                //     this.pad.D = (o[1] > 0.50);
                //     this.pad.L = (o[2] > 0.50);
                //     this.pad.R = (o[3] > 0.50);
                //     this.pad.A = (o[4] > 0.50);

                // } else {

                let d = Math.random();

                if (d > 0.99) {
                    this.px = (Math.random() * Game.w);
                    this.py = (Math.random() * Game.h);
                }

                if (this.px && this.py) {

                    this.vel.x = -(this.pos.x - this.px) / 100;
                    this.vel.y = -(this.pos.y - this.py) / 100;

                }

                this.pad.A = (Math.random() > 0.90);

                // }

                break;

            }

            if (this.aux.shotCnt > 5 && this.pad.A) {

                var a = 0, b = 30;

                var { x, y } = Calc.orb(this.pos.x, this.pos.y, this.pos.r + a, b);
                Make.shot(x, y, this.pos.r, ['ship']);
                Make.capsule(x, y);

                var { x, y } = Calc.orb(this.pos.x, this.pos.y, this.pos.r + a, b);
                var burst = Make.gunfire(x, y, this.pos.r);

                this.aux.shotCnt = 0;
                Game.play('shot');

            }

            if (this.pos.x < 0)
                this.vel.x += 10;
            if (this.pos.x > Game.w)
                this.vel.x -= 10;
            if (this.pos.y < 0)
                this.vel.y += 10;
            if (this.pos.y > Game.h)
                this.vel.y -= 10;

            // this.pos.r = this.vel.y;

            var shake = 1;
            this.pos.x = this.pos.x + Calc.rnd((shake * 2), -shake, true);
            this.pos.y = this.pos.y + Calc.rnd((shake * 2), -shake, true);

            var x = (this.pos.x - this.siz.w / 2) + Calc.rnd(this.siz.w / 2);
            var y = (this.pos.y - this.siz.h / 4) + Calc.rnd(this.siz.h / 2);
            // Make.trail(x, y, this.vel.x, this.pos.r);

        };

        Game.items[item.uid] = item;
        item.aux.shotCnt = 0;
        return item;

    }

    static shot(x, y, r, bad = [], s = 27) {

        var item = new Item({ cat: 'shot', bad, pos: { x, y }, siz: { w: s, h: s }, spr: { img: Game.img.shot, w: s, h: s } });

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
        // item.vel.x = -Calc.rnd(10);
        item.aim = true;

        Game.items[item.uid] = item;
        return item;

    }

    static trail(x, y, z, r, s = 96) {

        var u = 3;
        x = x + (-u + Math.random() * (u * 2)), y = y + (-u + Math.random() * (u * 2));

        var item = new Item({ cat: 'trail', pos: { x, y }, siz: { w: s, h: s }, spr: { img: Game.img.trail, len: 10, rep: false, die: true, w: s, h: s } });

        item.pos.z = 0.2 + z / 50 + Math.random() * 0.4;
        item.pos.r = -3 + r + Math.random() * 6;
        item.vel.a = -(Math.random() * 9.0);
        item.vel.x = -Calc.rnd(10);

        Game.items[item.uid] = item;
        return item;

    }

    static capsule(x, y, s = 18) {

        var item = new Item({ cat: 'capsule', pos: { x, y }, siz: { w: s, h: s }, spr: { img: Game.img.capsule, w: s, h: s } });

        item.custom = function () { this.att.alpha -= 0.9; if (this.att.alpha < 0.3) { delete Game.items[this.uid]; } }

        var nv = (v = 2) => -v + Math.random() * (v * 2);
        item.vel.r = -100 + Math.random() * 200;
        item.vel.f = 0.98;
        item.vel.x = nv();
        item.vel.y = nv();
        item.pad = true;

        Game.items[item.uid] = item;
        return item;

    }

    static gunfire(x, y, r = 0, s = 36) {

        var item = new Item({ cat: 'gunfire', pos: { x, y, r }, siz: { w: s, h: s }, spr: { img: Game.img.gunfire, w: s, h: s } });

        item.custom = function () { this.att.alpha *= 0.8; }

        Game.items[item.uid] = item;

    }

    static star() {

        var item = new Item({ cat: 'star', spr: { img: Game.img.star } });

        item.reset = function (min = 0, add = 0) {

            var a = 0.3, b = 1.5, c = 0.1, d = 5.0;

            this.pos.z = a + Math.random() * (b - a);

            var v = Calc.rng(this.pos.z, a, b, c, d);

            this.pos.y = Math.random() * Game.h;
            this.att.alpha = this.pos.z * 80;
            this.pos.x = min + add;
            this.vel.x = -v;
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