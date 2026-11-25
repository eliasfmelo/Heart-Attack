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
