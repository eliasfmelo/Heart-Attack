const { test, expect } = require('@playwright/test');

const caminho = 'file:///C:/Users/Lucas/Documents/Heart-Attack/index.html';

test('01 - Página inicial carrega', async ({ page }) => {
  await page.goto(caminho);
  await expect(page.locator('body')).toBeVisible();
});

test('02 - Base de pacientes está carregada', async ({ page }) =>  {
  await page.goto(caminho);

  const quantidade = await page.evaluate(() => {
    return window.HEART_DATASET_CSV.trim().split(/\r?\n/).length - 1;
  });

  expect(quantidade).toBe(8763);
});

test('03 - Módulo de analytics está carregado', async ({ page }) => {
  await page.goto(caminho);

  const carregado = await page.evaluate(() => {
    return typeof window.HeartGuardAnalytics.parseCSV === 'function';
  });

  expect(carregado).toBe(true);
});

test('04 - Gráficos estão presentes na página', async ({ page }) =>  {
  await page.goto(caminho);

  const graficos = await page.locator('canvas').count();

  expect(graficos).toBeGreaterThan(0);
});

test('05 - Simulador está presente', async ({ page }) => {
  await page.goto(caminho);

  await expect(page.locator('#simAge')).toBeVisible();
});


test('06 - Preset saudável executa a simulação corretamente', async ({ page }) => {
  await page.goto(caminho);

  await page.locator('#btnPresetHealthy').click();

  await expect(page.locator('#resPercentage')).not.toHaveText('');
  await expect(page.locator('#resBadge')).not.toHaveText('');

  await expect(page.locator('#resFactors'))
    .toContainText('Nenhum fator de alto risco identificado');
});

test('07 - Preset de risco identifica os fatores críticos', async ({ page }) => {
  await page.goto(caminho);

  await page.locator('#btnPresetRisk').click();

  const fatores = page.locator('#resFactors');

  await expect(fatores).toContainText('Colesterol elevado');
  await expect(fatores).toContainText('Pressão sistólica alta');
  await expect(fatores).toContainText('Tabagismo ativo');
  await expect(fatores).toContainText('Diabetes diagnosticado');
  await expect(fatores).toContainText('Obesidade / IMC elevado');
  await expect(fatores).toContainText('Histórico familiar cardiovascular');
  await expect(fatores).toContainText('Alto nível de estresse');
});

test('08 - Simulador aplica valores padrão quando campos numéricos estão vazios', async ({ page }) => {
  await page.goto(caminho);

  // Simula o modelo recebendo o paciente e devolvendo um resultado
  await page.evaluate(() => {
    window.__pacienteCapturado = null;

    window.predictHeartRisk = (patient) => {
      window.__pacienteCapturado = patient;

      return {
        percentage: '10.0',
        level: 'Baixo Risco',
        color: 'green',
        factors: []
      };
    };

    // Limpa os campos numéricos do simulador
    [
      'simChol',
      'simSystolic',
      'simHeart',
      'simTrig',
      'simStress',
      'simExercise'
    ].forEach(id => {
      document.getElementById(id).value = '';
    });
  });

  // Executa a previsão
  await page.locator('#btnPredict').click();

  // Recupera os dados enviados para o modelo
  const patient = await page.evaluate(() => window.__pacienteCapturado);

  // Verifica os valores padrão
  expect(patient.Age).toBe(55);
  expect(patient.Cholesterol).toBe(220);
  expect(patient.Systolic).toBe(120);
  expect(patient.HeartRate).toBe(75);
  expect(patient.Triglycerides).toBe(250);
  expect(patient.Stress).toBe(5);
  expect(patient.ExerciseHours).toBe(3.0);
});

test('09 - Simulador preserva zero horas de exercício', async ({ page }) => {
  await page.goto(caminho);

  await page.evaluate(() => {
    window.__pacienteCapturado = null;

    window.predictHeartRisk = (patient) => {
      window.__pacienteCapturado = patient;

      return {
        percentage: '10.0',
        level: 'Baixo Risco',
        color: 'green',
        factors: []
      };
    };

    document.getElementById('simExercise').value = '0';
  });

  await page.locator('#btnPredict').click();

  const patient = await page.evaluate(() => window.__pacienteCapturado);

  expect(patient.ExerciseHours).toBe(0);
});

test('10 - Simulador preserva zero de estresse', async ({ page }) => {
  await page.goto(caminho);

  await page.evaluate(() => {
    window.__pacienteCapturado = null;

    window.predictHeartRisk = (patient) => {
      window.__pacienteCapturado = patient;

      return {
        percentage: '10.0',
        level: 'Baixo Risco',
        color: 'green',
        factors: []
      };
    };

    document.getElementById('simStress').value = '0';
  });

  await page.locator('#btnPredict').click();

  const patient = await page.evaluate(() => window.__pacienteCapturado);

  expect(patient.Stress).toBe(0);
});

test('11 - Simulador rejeita idade abaixo do mínimo', async ({ page }) => {
  await page.goto(caminho);

  await page.evaluate(() => {
    window.__predicaoExecutada = false;

    window.predictHeartRisk = (patient) => {
      window.__predicaoExecutada = true;

      return {
        percentage: '10.0',
        level: 'Baixo Risco',
        color: 'green',
        factors: []
      };
    };

    document.getElementById('simAge').value = '17';
  });

  await page.locator('#btnPredict').click();

  const executou = await page.evaluate(() => window.__predicaoExecutada);

  expect(executou, 'Não deveria executar a predição com idade abaixo de 18').toBe(false);
});

test('12 - Simulador rejeita idade acima do máximo', async ({ page }) => {
  await page.goto(caminho);

  await page.evaluate(() => {
    window.__predicaoExecutada = false;

    window.predictHeartRisk = () => {
      window.__predicaoExecutada = true;

      return {
        percentage: '10.0',
        level: 'Baixo Risco',
        color: 'green',
        factors: []
      };
    };

    document.getElementById('simAge').value = '101';
  });

  await page.locator('#btnPredict').click();

  const executou = await page.evaluate(() => window.__predicaoExecutada);

  expect(executou, 'Não deveria executar a predição com idade acima de 100').toBe(false);
});