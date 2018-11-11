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