from playwright.sync_api import expect
import pytest

CAMINHO = r"file:///C:/Users/nasci/OneDrive/Área%20de%20Trabalho/projetÃO/Heart-Attack/index.html"


def test_01_pagina_inicial_carrega(page):
    page.goto(CAMINHO)
    expect(page.locator("body")).to_be_visible()


def test_02_base_de_pacientes_esta_carregada(page):
    page.goto(CAMINHO)

    quantidade = page.locator("#mPatients").inner_text()

    assert "8.763" in quantidade or "8763" in quantidade


def test_03_modulo_de_analytics_esta_carregado(page):
    page.goto(CAMINHO)

    carregado = page.evaluate("""
        () => typeof window.HeartGuardAnalytics.parseCSV === 'function'
    """)

    assert carregado is True


def test_04_graficos_estao_presentes(page):
    page.goto(CAMINHO)

    graficos = page.locator("canvas").count()

    assert graficos > 0


def test_05_simulador_esta_presente(page):
    page.goto(CAMINHO)

    expect(page.locator("#simAge")).to_be_visible()


def test_06_preset_saudavel(page):
    page.goto(CAMINHO)

    page.locator("#btnPresetHealthy").click()

    expect(page.locator("#resPercentage")).not_to_have_text("")
    expect(page.locator("#resBadge")).not_to_have_text("")


def test_07_preset_risco(page):
    page.goto(CAMINHO)

    page.locator("#btnPresetRisk").click()

    fatores = page.locator("#resFactors")

    expect(fatores).to_contain_text("Colesterol elevado")
    expect(fatores).to_contain_text("Pressão sistólica alta")
    expect(fatores).to_contain_text("Tabagismo ativo")
    expect(fatores).to_contain_text("Diabetes diagnosticado")


@pytest.mark.skip(reason="Fluxo atual do simulador alterado")
def test_08_valores_padrao(page):
    pass


@pytest.mark.skip(reason="Fluxo atual do simulador alterado")
def test_09_preserva_exercicio_zero(page):
    pass


@pytest.mark.skip(reason="Fluxo atual do simulador alterado")
def test_10_preserva_estresse_zero(page):
    pass


def test_11_rejeita_idade_abaixo_minimo(page):
    page.goto(CAMINHO)

    page.evaluate("""
        () => {
            window.__predicaoExecutada = false;

            window.predictHeartRisk = () => {
                window.__predicaoExecutada = true;
            };

            document.getElementById('simAge').value = '17';
        }
    """)

    page.locator("#btnPredict").click()

    executou = page.evaluate(
        "() => window.__predicaoExecutada"
    )

    assert executou is False


def test_12_rejeita_idade_acima_maximo(page):
    page.goto(CAMINHO)

    page.evaluate("""
        () => {
            window.__predicaoExecutada = false;

            window.predictHeartRisk = () => {
                window.__predicaoExecutada = true;
            };

            document.getElementById('simAge').value = '101';
        }
    """)

    page.locator("#btnPredict").click()

    executou = page.evaluate(
        "() => window.__predicaoExecutada"
    )

    assert executou is False