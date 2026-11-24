
const { test } = require('node:test');
const assert = require('node:assert');

const { parseCSV, normalizeRows } = require('../../src/analytics');

// Teste de integração: CSV -> parseCSV -> normalizeRows

test('deve integrar leitura CSV e normalização dos pacientes', () => {
    const csv = [
        'Age,Sex,Cholesterol,Blood Pressure,Heart Rate,Diabetes,Family History,Smoking,Obesity,Heart Attack Risk',
        '45,Male,230,120/80,80,No,No,No,No,Low',
        '60,Female,195,140/90,95,Yes,Yes,No,Yes,High'
    ].join('\n');

    const rawData = parseCSV(csv);
    const patients = normalizeRows(rawData);

    assert.strictEqual(rawData.length, 2);
    assert.strictEqual(patients.length, 2);

    assert.strictEqual(patients[0].Age, 45);
    assert.strictEqual(patients[0].Cholesterol, 230);
    assert.strictEqual(patients[0].BloodPressure, '120/80');
    assert.strictEqual(patients[0].HeartRate, 80);
    assert.strictEqual(patients[0].HeartAttackRisk, 'Low');

    assert.strictEqual(patients[1].Age, 60);
    assert.strictEqual(patients[1].Cholesterol, 195);
    assert.strictEqual(patients[1].HeartRate, 95);
    assert.strictEqual(patients[1].HeartAttackRisk, 'High');
});

// Teste com cabeçalhos alternativos e delimitador ;

test('deve integrar CSV com cabeçalhos alternativos', () => {
    const csv = [
        'Idade;Sexo;Colesterol;Pressao arterial;Frequencia cardiaca;Risco',
        '35;Female;180;110/70;72;Low'
    ].join('\n');

    const patients = normalizeRows(parseCSV(csv));

    assert.strictEqual(patients.length, 1);
    assert.strictEqual(patients[0].Age, 35);
    assert.strictEqual(patients[0].Sex, 'Female');
    assert.strictEqual(patients[0].Cholesterol, 180);
    assert.strictEqual(patients[0].BloodPressure, '110/70');
    assert.strictEqual(patients[0].HeartRate, 72);
    assert.strictEqual(patients[0].HeartAttackRisk, 'Low');
});

// Teste de arquivo sem registros

test('deve retornar lista vazia quando CSV contém somente cabeçalho', () => {
    const csv = 'Age,Sex,Cholesterol';

    const patients = normalizeRows(parseCSV(csv));

    assert.deepStrictEqual(patients, []);
});
