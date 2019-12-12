class Game {

    static init() {

        Game.scale = 1;

        Game.img = { ship: null, shot: null, fire: null, star: null, capsule: null, gunfire: null, trail: null, enemy1: null };
        Game.pad = { 37: false, 38: false, 39: false, 40: false, 90: false };
        window.addEventListener('keydown', Game.key1, false);
        window.addEventListener('keyup', Game.key0, true);
        Game.cnv = document.getElementById('canvas');
        Game.dataset = { inputs: [], outputs: [] };
        Game.ctx = Game.cnv.getContext('2d');
        Game.nn = new RedeNeural(3, 4, 5);
        Game.w = 1280 * Game.scale;
        Game.h = 720 * Game.scale;
        Game.snd = { shot: null };
        Game.cnv.height = Game.h;
        Game.cnv.width = Game.w;
        Game.last = new Date();
        Game.training = false;
        Game.trained = false;
        Game.vel = 1 / 10;
        Game.glow = false;
        Game.items = {};
        Game.fps = 60;
        Game.uid = 0;
        Game.load();
        Game.loop();

    }

    static key0(e) { Game.pad[e.keyCode] = false; }

    static key1(e) { Game.pad[e.keyCode] = true; }

    static load() {

        for (let i in Game.img) {
            var img = new Image();
            img.src = `assets/${i}.png`;
            Game.img[i] = img;
        }

        for (let i in Game.snd) {
            var snd = new Audio();
            snd.src = `assets/${i}.wav`;
            Game.snd[i] = snd;
        }

    }

    static loop() {

        if (!Game.training) {

            var items = Object.keys(Game.items).length;
            Game.ctx.clearRect(0, 0, Game.w, Game.h);

            Game.text(items, 10, 15);
            Game.text(`${Game.dataset.inputs.length.toString().padStart(5, 0)}/1000`, 50, 15);

            for (let uid in Game.items) {

                let item = Game.items[uid];

                item.update();
                item.custom();
                Game.draw(item);

            }

        }

        setTimeout(Game.loop, (1000 / Game.fps));

    }

    static text(text, x, y) {

        var fs = 16;
        var color = 'rgb(0,200,0)';
        Game.ctx.font = `bold ${fs}px monospace`;

        Game.ctx.save();
        Game.ctx.shadowBlur = 10;
        Game.ctx.fillStyle = color;
        Game.ctx.shadowColor = color;
        Game.ctx.fillText(text, x, y);
        Game.ctx.restore();

    }

    static draw(item) {

        Game.ctx.save();

        var alpha = (item.att.alpha / 100) + 0.1;

        Game.ctx.globalAlpha = alpha;
        Game.ctx.globalCompositeOperation = item.att.gco;
        if (Game.glow) Game.ctx.shadowBlur = item.att.glow.siz;
        if (Game.glow) Game.ctx.shadowColor = item.att.glow.rgb;

        Game.ctx.translate(item.pos.x, item.pos.y);
        Game.ctx.rotate(Calc.deg(item.pos.r));

        var w = item.siz.w * item.pos.z;
        var h = item.siz.h * item.pos.z;

        Game.ctx.drawImage(item.spr.img, (item.spr.w * item.spr.num), 0, item.spr.w, item.spr.h, -(w / 2), -(h / 2), w, h);

        Game.ctx.restore();

    }

    static play(name) {
        // Game.snd[name].pause();
        // Game.snd[name].volume = 0.2;
        // Game.snd[name].currentTime = 0;
        // Game.snd[name].play();
    }

    static train() {

        if (!Game.trained) {

            Game.training = true;

            for (var i = 0; i < 10000; i++) {
                var index = Math.floor(Math.random() * (Game.dataset.inputs.length - 1));
                Game.nn.train(Game.dataset.inputs[index], Game.dataset.outputs[index]);
                console.log(`treinando... ${i}/10000`);
            }

            console.log(`testando aprendizado...`);
            var na = Game.nn.predict([100, 99]);
            var ya = Game.nn.predict([100, 0]);

            // if (na[4] < 0.10 && ya[4] > 0.40) {

            Game.training = false;
            Game.trained = true;
            console.log("fim!");

            // } else { console.log(na, ya); }

        }

    }

};