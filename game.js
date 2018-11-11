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

        let plusVector = new Vector(v);

        plusVector.x = this.x + v.x;
        plusVector.y = this.y + v.y;

        return plusVector;
    };


    times(factor) {
        let multipliedVector = new Vector(this);

        multipliedVector.x = this.x * factor;
        multipliedVector.y = this.y * factor;

        return multipliedVector;

    }
}

// Проверка класса Vector
const start = new Vector(30, 50);
const moveTo = new Vector(5, 10);
const finish = start.plus(moveTo.times(2));

console.log(`Исходное расположение: ${start.x}:${start.y}`);
console.log(`Текущее расположение: ${finish.x}:${finish.y}`);
//-----------------------

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
            this.act = function() {};

            Object.defineProperty(this, 'type', {
                value: 'actor',
                writable: false
            });

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
                }
            });
        } // constructor

    isIntersect(actor) {
            if (actor == 'undefined' || !actor instanceof Actor) {
                throw new Error('Должет быть передан параметр типа Actor');
            } else if (actor == this) return false;

            else if (this.left < actor.bottom &&
                this.bottom > actor.left &&
                this.top < actor.right &&
                this.right > actor.top) {
                return true;
            } else return false;
        } // isIntersect
} // Actor
//===========================================

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