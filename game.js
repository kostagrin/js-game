'use strict';
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    plus(v) {

        if (!(v instanceof Vector)) {
            throw new Error('Можно прибавлять к вектору только вектор типа Vector');
        }

        return new Vector(this.x + v.x, this.y + v.y);
    };

    times(z) {
        return new Vector(this.x * z, this.y * z);
    }
}


class Actor {
    constructor(pos = new Vector(0, 0),
            size = new Vector(1, 1),
            speed = new Vector(0, 0)
        ) {
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
            this.act = function() {};

            Object.defineProperties(this, {
                'left': {
                    get() { return this.pos.x }
                },
                'right': {
                    get() { return this.pos.x + this.size.x }
                },
                'top': {
                    get() { return this.pos.y }
                },
                'bottom': {
                    get() { return this.pos.y + this.size.y }
                },
                'type': {
                    value: 'actor',
                    writable: false
                }
            });
        } // constructor

    isIntersect(actor) {
            if (actor == 'undefined' || !(actor instanceof Actor)) {
                throw new Error('Следует передать аргумент типа Actor');
            } else if (actor == this) return false;

            else if (
                this.left < actor.right &&
                this.bottom > actor.top &&
                this.top < actor.bottom &&
                this.right > actor.left) return true
            else return false;
        } // isIntersect
} // class Actor



// ИГРОВОЕ ПОЛЕ
class Level {
    constructor(grid, actors) {
            this.grid = grid;
            this.actors = actors;

            /*ЧТО ЗНАЧИТ: "тип которого — свойство type — равно player"? 
            И
            "Игорок передаётся с остальными движущимися объектами"?*/
            this.player = 'player';


            this.height = this.grid.length || 0;

            this.width = this.grid.reduce((memo, x) => {
                return x.length > memo ? x.length : memo;
            }, 0);

            this.status = null;
            this.finishDelay = 1;
        } // constructor


    isFinished() {
        return (this.status !== null && this.finishDelay < 0);
    }

    actorAt(actor) {
        if (!actor || !(actor instanceof Actor)) {
            throw new Error('Следует передать аргумент типа Actor')
        };

        return this.actors.find((one) => {
            return one.isIntersect(actor);
        });
    }

    obstacleAt(pos, size) {
        if (!(size instanceof Vector) && !(size instanceof Vector)) {
            throw new Error('Следует передать аргументы типа Vector');
        }

        let actor = new Actor(pos, size);

        if (actor.bottom > this.height) {
            return 'lava';
        } else if (
            (actor.left < 0) ||
            (actor.top < 0) ||
            (actor.right > this.width)) {
            return 'wall';
        } else {
            return undefined;
        }
    }

    removeActor(actor) {
        if (!actor || !(actor instanceof Actor)) return;
        else this.actors.splice(this.actors.indexOf(actor), 1);
    }

    noMoreActors(type) {

        let flag = true;
        this.actors.forEach((actor) => {
            if (actor.type == type) {
                flag = false
            };
        });
        return flag;
    }

    playerTouched(type /*string*/ , actor /*Actor*/ ) {

        if (this.status !== null) return;

        else if (type === 'lava' || type === 'fireball') {
            this.status = 'lost';
        } else if (type === 'coin' && actor instanceof Coin) {
            delete actor;
            if (this.noMoreActors(type)) this.status = 'won';
        }
    }

} //class Level



// Монета
class Coin extends Actor {
    constructor(pos) {
        super(pos, size);
        this.size = new Vector(0.6, 0.6);
        this.pos = pos.plus(0.2, 0.1);
    };


    Object.defineProperties(this, {
        'type': {
            value: 'coin'
        },
        'springSpeed': { // Скорость подпрыгивания
            get() { return 8 }
        },
        'springDist': { // Радиус подпрыгивания
            get() { return 0.07 }
        },
        'spring': { // Фаза подпрыгивания
            get() { return Math.floor(Math.random() * 2 * Math.PI) },
            set(value) { return Math.floor(Math.random() * 2 * Math.PI) * value }
        },
    });

    updateSpring(t = 1) { // Обновляет фазу подпрыгивания
        this.spring += this.springSpeed * t;
    };

    getSpringVector() { // Создает и возвращает вектор подпрыгивания
        return new Vector(0, Math.sin(this.spring) * this.springDist);
    };

    getNextPosition(t = 1) { // Обновляет текущую фазу
        /*Новый вектор равен базовому вектору положения, 
        увеличенному на вектор подпрыгивания. 
        Увеличивать нужно именно базовый вектор положения, 
        который получен в конструкторе, а не текущий.*/
        /*ЧТО ЗНАЧИТ "базовый вектор положения"? и
        "текущий"? */
        let nextPosition = new Vector().times(getSpringVector);
    };

    act(t) {
        /*Принимает один аргумент — время. 
        Получает новую позицию объекта и задает её как текущую...*/
        /*ЧТО ЗНАЧИТ "новая позиция объекта"? Какого объекта?*/
    }
} // class Coin