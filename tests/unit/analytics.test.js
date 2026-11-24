const { test } = require('node:test');
const assert = require('node:assert');
const { avg, parseNumber, yes, parsePressure, normalizeKey, getValue, normalizeRows, parseCSV } = require('../../src/analytics');
test('deve calcular a média de números', () => {
    assert.strictEqual(avg([10, 20, 30]), 20);
});

test('deve retornar zero para uma lista vazia', () => {
    assert.strictEqual(avg([]), 0);
});

test('deve retornar o próprio número quando há apenas um elemento', () => {
    assert.strictEqual(avg([15]), 15);
});

test('deve calcular a média de números negativos', () => {
    assert.strictEqual(avg([-10, -20, -30]), -20);
});

test('deve calcular a média de números decimais', () => {
    assert.strictEqual(avg([1.5, 2.5, 3.5]), 2.5);
});

test('deve calcular uma média decimal', () => {
    assert.strictEqual(avg([1, 2]), 1.5);
});

test('deve converter string numérica para número', () => {
    assert.strictEqual(parseNumber('120'), 120);
});

test('deve converter decimal com vírgula', () => {
    assert.strictEqual(parseNumber('120,5'), 120.5);
});

test('deve aceitar número já recebido como numérico', () => {
    assert.strictEqual(parseNumber(75), 75);
});

test('deve retornar NaN para texto inválido', () => {
    assert.ok(Number.isNaN(parseNumber('abc')));
});

test('deve retornar NaN para valor vazio', () => {
    assert.ok(Number.isNaN(parseNumber('')));
});

test('deve retornar NaN para null', () => {
    assert.ok(Number.isNaN(parseNumber(null)));
});

// Testes da função yes()

test('deve reconhecer sim', () => {
    assert.strictEqual(yes('sim'), true);
});

test('deve reconhecer YES em maiúsculo', () => {
    assert.strictEqual(yes('YES'), true);
});

test('deve reconhecer true', () => {
    assert.strictEqual(yes('true'), true);
});

test('deve retornar false para não', () => {
    assert.strictEqual(yes('não'), false);
});

// Testes da função parsePressure()

test('deve extrair a pressão sistólica', () => {
    assert.strictEqual(parsePressure('120/80'), 120);
});

test('deve extrair número de texto', () => {
    assert.strictEqual(parsePressure('Pressão: 140'), 140);
});

test('deve converter pressão com decimal', () => {
    assert.strictEqual(parsePressure('120,5/80'), 120.5);
});

test('deve retornar NaN para texto sem números', () => {
    assert.ok(Number.isNaN(parsePressure('sem dados')));
});

// Testes da função normalizeKey()

test('deve converter letras para minúsculas', () => {
    assert.strictEqual(normalizeKey('AGE'), 'age');
});

test('deve remover espaços e símbolos', () => {
    assert.strictEqual(normalizeKey('Heart Attack!'), 'heartattack');
});

test('deve remover acentos', () => {
    assert.strictEqual(normalizeKey('Pressão'), 'pressao');
});

test('deve retornar vazio para null', () => {
    assert.strictEqual(normalizeKey(null), '');
});

// Testes da função getValue()

test('deve encontrar valor usando nome equivalente', () => {
    assert.strictEqual(getValue({ Age: 45 }, ['age']), 45);
});

test('deve encontrar coluna mesmo com acentos', () => {
    assert.strictEqual(getValue({ 'Pressão': 120 }, ['pressao']), 120);
});

test('deve buscar usando uma lista de nomes possíveis', () => {
    assert.strictEqual(getValue({ idade: 30 }, ['age', 'idade']), 30);
});

test('deve retornar vazio quando coluna não existe', () => {
    assert.strictEqual(getValue({ Age: 45 }, ['peso']), '');
});

test('deve retornar vazio quando objeto não possui colunas correspondentes', () => {
    assert.strictEqual(getValue({}, ['age']), '');
});

test('deve respeitar o valor zero da coluna', () => {
    assert.strictEqual(getValue({ Age: 0 }, ['age']), 0);
});

// Testes da função normalizeRows()

test('deve normalizar idade e colesterol para números', () => {
    const result = normalizeRows([
        { Age: '45', Cholesterol: '230' }
    ]);

    assert.strictEqual(result[0].Age, 45);
    assert.strictEqual(result[0].Cholesterol, 230);
});

test('deve reconhecer nomes alternativos das colunas', () => {
    const result = normalizeRows([
        { Idade: '50', Colesterol: '190', Sexo: 'Female' }
    ]);

    assert.strictEqual(result[0].Age, 50);
    assert.strictEqual(result[0].Cholesterol, 190);
    assert.strictEqual(result[0].Sex, 'Female');
});

test('deve manter os demais dados do registro', () => {
    const result = normalizeRows([
        {
            Age: '40',
            Diabetes: 'Yes',
            Smoking: 'No',
            Obesity: 'Yes'
        }
    ]);

    assert.strictEqual(result[0].Diabetes, 'Yes');
    assert.strictEqual(result[0].Smoking, 'No');
    assert.strictEqual(result[0].Obesity, 'Yes');
});

test('deve remover registro completamente vazio', () => {
    const result = normalizeRows([{}]);

    assert.strictEqual(result.length, 0);
});

test('deve manter registro com idade zero', () => {
    const result = normalizeRows([
        { Age: '0' }
    ]);

    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].Age, 0);
});

test('deve retornar lista vazia quando não recebe registros', () => {
    const result = normalizeRows([]);

    assert.deepStrictEqual(result, []);
});

// Testes da função parseCSV()

test('deve interpretar CSV separado por vírgulas', () => {
    const csv = 'Age,Sex\n45,Male';
    const result = parseCSV(csv);

    assert.deepStrictEqual(result, [
        { Age: '45', Sex: 'Male' }
    ]);
});

test('deve interpretar CSV separado por ponto e vírgula', () => {
    const csv = 'Age;Sex\n50;Female';
    const result = parseCSV(csv);

    assert.deepStrictEqual(result, [
        { Age: '50', Sex: 'Female' }
    ]);
});

test('deve retornar lista vazia para texto inválido', () => {
    assert.deepStrictEqual(parseCSV(''), []);
    assert.deepStrictEqual(parseCSV(null), []);
});

test('deve retornar lista vazia quando há apenas cabeçalho', () => {
    assert.deepStrictEqual(parseCSV('Age,Sex,Cholesterol'), []);
});

test('deve preservar vírgula dentro de campo entre aspas', () => {
    const csv = 'City,Age\n"Recife, PE",25';
    const result = parseCSV(csv);

    assert.deepStrictEqual(result, [
        { City: 'Recife, PE', Age: '25' }
    ]);
});