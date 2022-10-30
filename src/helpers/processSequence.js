/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {allPass, andThen, gt, ifElse, lt, modulo, otherwise, partialRight, pipe, prop, tap, test} from "ramda"

const api = new Api();

const power2 = partialRight(Math.pow, [2]);

const getRemainderOf3 = partialRight(modulo, [3]);

const getLength = prop('length');

const convertToFloat = value => parseFloat(value);

const roundNumber = value => Math.round(value);

const greaterThan1 = partialRight(gt, [1]);
const lessThan11 = partialRight(lt, [11]);
const validLength = allPass([pipe(getLength, greaterThan1), pipe(getLength, lessThan11)]);
const isNumber = test(/\d+\.?\d?/);
const isPositive = value => parseFloat(value) > 0;

const validateNumber = ifElse(
  allPass([validLength, isNumber, isPositive]),
  (value) => Promise.resolve(value),
  () => Promise.reject('ValidationError')
)

const prepareParams = value => ({from: 10, to: 2, number: value});

const numbersApi = api.get('https://api.tech/numbers/base')

const getAnimal = (id) => api.get(`https://animals.tech/${id}`, {})

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
  pipe(
    tap(writeLog),
    validateNumber,
    andThen(pipe(
      convertToFloat,
      roundNumber,
      tap(writeLog),
      prepareParams,
      numbersApi,
      andThen(pipe(
        prop('result'),
        tap(writeLog),
        getLength,
        tap(writeLog),
        power2,
        tap(writeLog),
        getRemainderOf3,
        tap(writeLog),
        getAnimal,
        andThen(pipe(
          prop('result'),
          handleSuccess
        ))
      ))
    )),
    otherwise(handleError),
  )(value);
}

export default processSequence;
