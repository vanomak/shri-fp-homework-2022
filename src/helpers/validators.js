/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
  all,
  allPass,
  complement,
  count,
  curry,
  equals,
  gt,
  lt,
  max,
  partialRight,
  pipe,
  prop,
  propOr,
  props,
  reduce,
  values,
} from 'ramda';

const isRed = curry(equals)('red');
const isWhite = curry(equals)('white');
const isGreen = curry(equals)('green');
const isOrange = curry(equals)('orange');
const isBlue = curry(equals)('blue');

const getStar = prop('star');
const getSquare = prop('square');
const getTriangle = prop('triangle');
const getCircle = prop('circle');
const getAll = curry(props)(['star', 'square', 'triangle', 'circle'])

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (figures) => allPass([
  pipe(getStar, isRed),
  pipe(getSquare, isGreen),
  pipe(getTriangle, isWhite),
  pipe(getCircle, isWhite),
])(figures);


// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (figures) => {
  return count(isGreen, getAll(figures)) >= 2;
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (figures) => count(isRed, getAll(figures)) === count(isBlue, getAll(figures));

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = (figures) => allPass([
  pipe(getCircle, isBlue),
  pipe(getStar, isRed),
  pipe(getSquare, isOrange),
])(figures);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
// Пишите в функциональном стиле - делайте код понятнее, говорили они...
const countItems = (items) => reduce((sum, current) => (
  {
    ...sum,
    [current]: sum[current] ? sum[current] + 1 : 1,
  }), {}, items);

const getWhite = propOr(0, 'white');
const isLessThan2 = partialRight(lt, [2]);
const isMoreThan2 = partialRight(gt, [2]);
const getCounts = pipe(getAll, countItems);
const getMaxColor = (counts) => reduce(max, 0, values(counts));

export const validateFieldN5 = (figures) => {
  return allPass([
    pipe(getCounts, getWhite, isLessThan2),
    pipe(getCounts, getMaxColor, isMoreThan2)
  ])(figures);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная.
// Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
const countGreen = figures => count(isGreen, getAll(figures))
const countRed = figures => count(isRed, getAll(figures))
const equals2 = curry(equals)(2)
const equals1 = curry(equals)(1)

export const validateFieldN6 = (figures) =>
  allPass([
    pipe(countGreen, equals2),
    pipe(getTriangle, isGreen),
    pipe(countRed, equals1)
  ])(figures);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (figures) =>
  all(isOrange)(getAll(figures));

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = (figures) => allPass([
  complement(pipe(getStar, isRed)),
  complement(pipe(getStar, isWhite)),
])(figures);

// 9. Все фигуры зеленые.
export const validateFieldN9 = (figures) => all(isGreen)(getAll(figures));

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
const isTriangleEqualsSquare = (figures) => getTriangle(figures) === getSquare(figures);

export const validateFieldN10 = (figures) =>
  allPass([
    isTriangleEqualsSquare,
    complement(pipe(getSquare, isWhite))
  ])(figures);
