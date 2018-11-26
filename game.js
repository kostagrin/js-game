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

//====================================
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ПРОВЕРКА РАБОТЫ КЛАССА Vector
//------------------------------------
// const start = new Vector(30, 50);
// const moveTo = new Vector(5, 10);
// const finish = start.plus(moveTo.times(2));

// console.log(`Исходное расположение: ${start.x}:${start.y}`);
// console.log(`Текущее расположение: ${finish.x}:${finish.y}`);
//------------------------------------
// РАБОТАЕТ
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//====================================


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
            } else if (actor === this) return false;

            else {
                return (
                    this.left < actor.right &&
                    this.bottom > actor.top &&
                    this.top < actor.bottom &&
                    this.right > actor.left
                );
            }
        } // isIntersect
} // class Actor

//====================================
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ПРОВЕРКА РАБОТЫ КЛАССА Actor
//------------------------------------
// const items = new Map();
// const player = new Actor();
// items.set('Игрок', player);
// items.set('Первая монета', new Actor(new Vector(10, 10)));
// items.set('Вторая монета', new Actor(new Vector(15, 5)));

// function position(item) {
//     return ['left', 'top', 'right', 'bottom']
//         .map(side => `${side}: ${item[side]}`)
//         .join(', ');
// }

// function movePlayer(x, y) {
//     player.pos = player.pos.plus(new Vector(x, y));
// }

// function status(item, title) {
//     console.log(`${title}: ${position(item)}`);
//     if (player.isIntersect(item)) {
//         console.log(`Игрок подобрал ${title}`);
//     }
// }

// items.forEach(status);
// movePlayer(10, 10);
// items.forEach(status);
// movePlayer(5, -5);
// items.forEach(status);
//------------------------------------
// РАБОТАЕТ
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//====================================


// ИГРОВОЕ ПОЛЕ
class Level {
    constructor(grid = [], actors = []) {
            this.grid = grid;
            this.actors = actors;
            this.player = actors.find(actor => actor.type === 'player');
            this.height = this.grid.length || 0;
            this.width = Math.max(...this.grid.map(row => row.length), 0);
            this.status = null;
            this.finishDelay = 1;
        } // constructor


    isFinished() {
        return (this.status !== null && this.finishDelay < 0);
    }


    actorAt(actor) {
        if (!(actor instanceof Actor)) {
            throw new Error('Следует передать аргумент типа Actor')
        };

        return this.actors.find(one => {
            if (one instanceof Actor) {
                return actor.isIntersect(one) === true;
            }
            return actor;
        });
    }


    obstacleAt(pos, size) {
            if (!(pos instanceof Vector) && !(size instanceof Vector)) {
                throw new Error('Следует передать аргументы типа Vector');
            }

            let actor = new Actor(pos, size);

            /*Округляем границы элемента до целочисленных значений,
            чтобы можно было отследить контакт и 
            использовать переменные в цикле.*/
            let top = Math.floor(actor.top);
            let right = Math.ceil(actor.right);
            let bottom = Math.ceil(actor.bottom)
            let left = Math.floor(actor.left);


            if (bottom > this.height) {
                return 'lava';
            } else if (
                left < 0 ||
                top < 0 ||
                right > this.width) {
                return 'wall';
            }

            for (let i = top; i < bottom; i++) {
                for (let j = left; j < right; j++) {
                    let obstacle = this.grid[i][j];
                    if (obstacle) {
                        return obstacle;
                    }
                }
            }

        } // obstacleAt


    removeActor(actor) {
        if (!actor || !(actor instanceof Actor)) return;
        else this.actors.splice(this.actors.indexOf(actor), 1);
    }


    noMoreActors(type) {
        let flag = true;

        this.actors.forEach((actor) => {
            if (actor.type === type) {
                flag = false
            };
        });

        return flag;
    }


    playerTouched(type, actor) {

        if (this.status !== null) return;

        else if (type === 'lava' || type === 'fireball') {
            this.status = 'lost';
        } else if (type === 'coin' && actor.type === 'coin') {
            this.removeActor(actor);
            if (this.noMoreActors(type)) this.status = 'won';
        }
    }
} //class Level


//====================================
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ПРОВЕРКА РАБОТЫ КЛАССА Level
//------------------------------------
// const grid = [
//     [undefined, undefined],
//     ['wall', 'wall']
// ];

// function MyCoin(title) {
//     this.type = 'coin';
//     this.title = title;
// }
// MyCoin.prototype = Object.create(Actor);
// MyCoin.constructor = MyCoin;

// const goldCoin = new MyCoin('Золото');
// const bronzeCoin = new MyCoin('Бронза');
// const player = new Actor();
// const fireball = new Actor();

// const level = new Level(grid, [goldCoin, bronzeCoin, player, fireball]);

// level.playerTouched('coin', goldCoin);
// level.playerTouched('coin', bronzeCoin);

// if (level.noMoreActors('coin')) {
//     console.log('Все монеты собраны');
//     console.log(`Статус игры: ${level.status}`);
// }

// const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
// if (obstacle) {
//     console.log(`На пути препятствие: ${obstacle}`);
// }

// const otherActor = level.actorAt(player);
// if (otherActor === fireball) {
//     console.log('Пользователь столкнулся с шаровой молнией');
// }
//------------------------------------
// ОШИБОК В КОНСОЛИ НЕТ, НО РУЗУЛЬТАТ ОТОБРАЖАЕТСЯ НЕ ПОЛНОСТЬЮ 
// Все монеты собраны
// Статус игры: won
// На пути препятствие: wall <--> В КОНСОЛИ ТОЛЬКО ЭТО
// Пользователь столкнулся с шаровой молнией
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//====================================


// Монета
class Coin extends Actor {
    constructor(pos = new Vector(0, 0)) {
        super(pos, size, speed);
        this.size = new Vector(0.6, 0.6);
        this.pos = pos.plus(0.2, 0.1);
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
} // class Coin



// Парсер уровня
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
        } else if (symbol === '!') {
            return 'lava';
        } else return undefined;
    };


    createGrid(arr = []) {
        return arr.map(el => el.split('').map(sym => this.obstacleFromSymbol(sym)));
    };


    // createActors(arr = []) {
    // ИСХОДЯ ИЗ ЗАДАНИЯ НЕ МОГУ ПОНЯТЬ, КАК РЕАЛИЗОВАТЬ ЭТОТ МЕТОД
    //     }


    parse(arr) {
        return new Level(this.createGrid(arr), this.createActors(arr));
    };
} // class LevelParser

//====================================
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ПРОВЕРКА РАБОТЫ КЛАССА LevelParser
//------------------------------------
// const plan = [
//     ' @ ',
//     'x!x'
// ];

// const actorsDict = Object.create(null);
// actorsDict['@'] = Actor;

// const parser = new LevelParser(actorsDict);
// const level = parser.parse(plan);

// level.grid.forEach((line, y) => {
//     line.forEach((cell, x) => console.log(`(${x}:${y}) ${cell}`));
// });

// level.actors.forEach(actor => console.log(`(${actor.pos.x}:${actor.pos.y}) ${actor.type}`));
//------------------------------------
// 
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//====================================


//Шаровая молния
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

//====================================
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ПРОВЕРКА РАБОТЫ КЛАССА Fireball
//------------------------------------
const time = 5;
const speed = new Vector(1, 0);
const position = new Vector(5, 5);

const ball = new Fireball(position, speed);

const nextPosition = ball.getNextPosition(time);
console.log(`Новая позиция: ${nextPosition.x}: ${nextPosition.y}`);

ball.handleObstacle();
console.log(`Текущая скорость: ${ball.speed.x}: ${ball.speed.y}`);
//------------------------------------
// РАБОТАЕТ 
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//====================================


class HorizontalFireball extends Fireball {
    constructor(pos) {
        super(pos, size, speed);
        this.speed = speed(2, 0);
    };
}


class VerticalFireball extends Fireball {
    constructor(pos) {
        super(pos, size, speed);
        this.speed = speed(0, 2);
    };
}


class FireRain extends Fireball {
    constructor(pos) {
        super(pos, size, speed);
        this.speed = speed(3, 0);
        this.initialPosition = pos;
    };

    handleObstacle() {
        this.pos = this.initialPosition;
    };
}


class Player extends Actor {
    constructor(pos) {
        super(pos, size, speed);
        this.pos = pos.plus(0, -0.5);
        this.size = size(0.8, 1, 5);
        this.speed = speed;
    };

    get type() {
        return 'player';
    };
}