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

//=======================
const start = new Vector(30, 50);
const moveTo = new Vector(5, 10);
const finish = start.plus(moveTo.times(2));

console.log(`Исходное расположение: ${start.x}:${start.y}`);
console.log(`Текущее расположение: ${finish.x}:${finish.y}`);
//=======================

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
} // Actor

//=======================
const items = new Map();
const player = new Actor();
items.set('Игрок', player);
items.set('Первая монета', new Actor(new Vector(10, 10)));
items.set('Вторая монета', new Actor(new Vector(15, 5)));

function position(item) {
    return ['left', 'top', 'right', 'bottom']
        .map(side => `${side}: ${item[side]}`)
        .join(', ');
}

function movePlayer(x, y) {
    player.pos = player.pos.plus(new Vector(x, y));
}

function status(item, title) {
    console.log(`${title}: ${position(item)}`);
    if (player.isIntersect(item)) {
        console.log(`Игрок подобрал ${title}`);
    }
}

items.forEach(status);
movePlayer(10, 10);
items.forEach(status);
movePlayer(5, -5);
items.forEach(status);
//=======================

class Level {
    constructor(grid = [], actors = []) {
        this.grid = grid;
        this.actors = actors;

        /*Что значит: "тип которого — свойство type — равно player"? 
        и
        "Игорок передаётся с остальными движущимися объектами"?
        Пожалуйста, можно дать развёрнутый ответ; так, чтобы было
        понянто как писать эту часть кода.*/
        this.player = 'player';


        this.status = null;
        this.finishDelay = 1;
    }

    get height() {
        return this.grid.length;
    }

    get width() {
        this.grid.reduce((memo, el) => {
            return memo.length < el.length ? el : memo;
        }, this.grid[0]);
    }

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

    obstacleAt(direction, dimention) {
        if (!(direction instanceof Vector) && !(dimention instanceof Vector)) {
            throw new Error('Следует передать аргументы типа Vector');
        }
    }
}

const lev = new Level();
console.log(lev);

//=======================
// const grid = [
//     [undefined, undefined],
//     ['wall', 'wall']
//   ];

//   function MyCoin(title) {
//     this.type = 'coin';
//     this.title = title;
//   }
//   MyCoin.prototype = Object.create(Actor);
//   MyCoin.constructor = MyCoin;

//   const goldCoin = new MyCoin('Золото');
//   const bronzeCoin = new MyCoin('Бронза');
//   const player = new Actor();
//   const fireball = new Actor();

//   const level = new Level(grid, [ goldCoin, bronzeCoin, player, fireball ]);

//   level.playerTouched('coin', goldCoin);
//   level.playerTouched('coin', bronzeCoin);

//   if (level.noMoreActors('coin')) {
//     console.log('Все монеты собраны');
//     console.log(`Статус игры: ${level.status}`);
//   }

//   const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
//   if (obstacle) {
//     console.log(`На пути препятствие: ${obstacle}`);
//   }

//   const otherActor = level.actorAt(player);
//   if (otherActor === fireball) {
//     console.log('Пользователь столкнулся с шаровой молнией');
//   }
//=======================