'use strict';
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    };

    plus(v) {
        if (!(v instanceof Vector)) {
            throw new Error('Можно прибавлять к вектору только вектор типа Vector');
        }
        return new Vector(this.x + v.x, this.y + v.y);
    };

    times(z) {
        return new Vector(this.x * z, this.y * z);
    };
};



class Actor {
    constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
            if (!(pos instanceof Vector)) {
                throw new Error('Параметром pos можно передавать только вектор типа Vector');
            }
            if (!(size instanceof Vector)) {
                throw new Error('Параметром size можно передавать только вектор типа Vector');
            }
            if (!(speed instanceof Vector)) {
                throw new Error('Параметром speed можно передавать только вектор типа Vector');
            }

            this.pos = pos;
            this.size = size;
            this.speed = speed;
        } // constructor

    act() {};

    get type() {
        return 'actor';
    };

    get left() {
        return this.pos.x;
    };

    get right() {
        return this.pos.x + this.size.x;
    };

    get top() {
        return this.pos.y;
    };

    get bottom() {
        return this.pos.y + this.size.y;
    };

    isIntersect(actor) {
            if (actor === undefined || !(actor instanceof Actor)) {
                throw new Error('Следует передать аргумент типа Actor');
            } else if (actor === this) {
                return false;
            } else {
                return (
                    this.left < actor.right &&
                    this.bottom > actor.top &&
                    this.top < actor.bottom &&
                    this.right > actor.left
                );
            }
        } // isIntersect
} // class Actor



class Level {
    constructor(grid = [], actors = []) {
        this.grid = grid;
        this.actors = actors;
        this.status = null;
        this.finishDelay = 1;
    }

    get player() {
        return this.actors.find(actor => actor.type === 'player');
    }

    get height() {
        return this.grid.length;
    }

    get width() {
        return Math.max(...this.grid.map(row => row.length), 0);
    }

    isFinished() {
        return this.status !== null && this.finishDelay < 0;
    }


    actorAt(actor) {
        if (!(actor instanceof Actor)) {
            throw new Error('Следует передать аргумент типа Actor')
        };

        return this.actors.find(one => actor.isIntersect(one));
    }


    obstacleAt(pos, size) {
        if (!(pos instanceof Vector) && !(size instanceof Vector)) {
            throw new Error('Следует передать аргументы типа Vector');
        }

        let actor = new Actor(pos, size);

        // let top = Math.floor(actor.top);
        // let right = Math.ceil(actor.right);
        // let bottom = Math.ceil(actor.bottom);
        // let left = Math.floor(actor.left);

        const top = Math.floor(actor.top),
            right = Math.ceil(actor.right),
            bottom = Math.ceil(actor.bottom),
            left = Math.floor(actor.left);

        if (bottom > this.height) {
            return 'lava';
        } else if (left < 0 || top < 0 || right > this.width) {
            return 'wall';
        }


        for (let y = top; y < bottom; y++) {
            for (let x = left; x < right; x++) {
                const obstacle = this.grid[y][x];
                if (obstacle) {
                    return obstacle;
                }
            }
        }
    }


    removeActor(actor) {
        this.actors.splice(this.actors.indexOf(actor), 1);
    }


    noMoreActors(type) {
        return !this.actors.some(actor => actor.type === type);
    }


    playerTouched(type, actor) {
        /*Former string 156; conditions after "if"
        have been nested in curly brackets.*/
        if (this.status !== null) {
            return;
        } else if (type === 'lava' || type === 'fireball') {
            this.status = 'lost';
        } else if (type === 'coin' && actor.type === 'coin') {
            this.removeActor(actor);
            if (this.noMoreActors(type)) {
                this.status = 'won';
            }
        }
    }
} // class Level




class LevelParser {
    constructor(dictionary) {
        this.dictionary = Object.assign({}, dictionary);
    };

    actorFromSymbol(symbol) {
        return this.dictionary[symbol];
    };

    obstacleFromSymbol(symbol) {
        if (symbol === 'x') {
            return 'wall';
        }
        if (symbol === '!') {
            return 'lava';
        }
    };


    createGrid(arr = []) {
        return arr.map(el => el.split('').map(sym => this.obstacleFromSymbol(sym)));
    };


    createActors(plan) {
        let actors = [];

        plan.forEach((planY, y) => {
            planY.split('').forEach((planX, x) => {
                let createActor = this.actorFromSymbol(planX);
                if (typeof createActor === 'function') {
                    let actorInstance = new createActor(new Vector(x, y));
                    if (actorInstance instanceof Actor) {
                        actors.push(actorInstance);
                    }
                }
            });
        });

        return actors;
    }


    parse(arr) {
        return new Level(this.createGrid(arr), this.createActors(arr));
    };
} // class LevelParser




class Fireball extends Actor {
    constructor(pos, size, speed) {
        super(pos, speed, size);
    };

    get type() {
        return 'fireball';
    };

    getNextPosition(t = 1) {
        return this.pos.plus(this.speed.times(t));
    };

    handleObstacle() {
        this.speed = this.speed.times(-1);
    };

    act(t, level) {
        let nextPosition = this.getNextPosition(t);
        if (level.obstacleAt(nextPosition, this.size)) {
            this.handleObstacle();
        } else {
            this.pos = nextPosition;
        }
    };

} // class Fireball



class HorizontalFireball extends Fireball {
    constructor(pos = new Vector(0, 0)) {
        super(pos, new Vector(2, 0));
    };
}


class VerticalFireball extends Fireball {
    constructor(pos = new Vector(0, 0)) {
        super(pos, new Vector(0, 2));
    };
}


class FireRain extends Fireball {
    constructor(pos = new Vector(0, 0)) {
        super(pos, new Vector(0, 3));
        this.initialPosition = pos;
    };

    handleObstacle() {
        this.pos = this.initialPosition;
    };
}



class Coin extends Actor {
    constructor(pos = new Vector(0, 0)) {
        super(pos.plus(new Vector(0.2, 0.1)), new Vector(0.6, 0.6));
        this.springSpeed = 8;
        this.springDist = 0.07;
        this.spring = Math.floor(Math.random() * 2 * Math.PI);
        this.spot = this.pos; // начальные координаты для getNextPosition
    };

    get type() {
        return 'coin';
    }

    updateSpring(t = 1) { // Обновляет фазу подпрыгивания
        this.spring += this.springSpeed * t;
    };

    getSpringVector() { // Создает и возвращает вектор подпрыгивания
        return new Vector(0, Math.sin(this.spring) * this.springDist);
    };

    getNextPosition(t = 1) { // Обновляет текущую фазу
        this.updateSpring(t);
        return this.spot.plus(this.getSpringVector());
    };

    act(t) {
        this.pos = this.getNextPosition(t);
    }
}


class Player extends Actor {
    constructor(pos = new Vector(0, 0)) {
        super(pos.plus(new Vector(0, -0.5)), new Vector(0.8, 1.5));
    };

    get type() {
        return 'player';
    };
}

//==========================================

const schemas = loadLevels();

const dictionary = {
    '@': Player,
    '=': HorizontalFireball,
    '|': VerticalFireball,
    'o': Coin,
    'v': FireRain
}

const parser = new LevelParser(dictionary);

schemas.then(result => {
    runGame(JSON.parse(result), parser, DOMDisplay)
        .then(() => alert('Вы выиграли!'));
});