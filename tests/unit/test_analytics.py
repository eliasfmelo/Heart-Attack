import math

from src.analytics import (
    avg,
    parse_number,
    yes,
    parse_pressure,
    normalize_key,
    get_value,
    normalize_rows,
    parse_csv
)


# Testes da função avg()

def test_deve_calcular_media_de_numeros():
    assert avg([10, 20, 30]) == 20


def test_deve_retornar_zero_para_lista_vazia():
    assert avg([]) == 0


def test_deve_retornar_o_proprio_numero_quando_ha_apenas_um_elemento():
    assert avg([15]) == 15


def test_deve_calcular_media_de_numeros_negativos():
    assert avg([-10, -20, -30]) == -20


def test_deve_calcular_media_de_numeros_decimais():
    assert avg([1.5, 2.5, 3.5]) == 2.5


def test_deve_calcular_uma_media_decimal():
    assert avg([1, 2]) == 1.5


# Testes da função parse_number()

def test_deve_converter_string_numerica_para_numero():
    assert parse_number("120") == 120


def test_deve_converter_decimal_com_virgula():
    assert parse_number("120,5") == 120.5


def test_deve_aceitar_numero_ja_recebido_como_numerico():
    assert parse_number(75) == 75


def test_deve_retornar_nan_para_texto_invalido():
    assert math.isnan(parse_number("abc"))


def test_deve_retornar_nan_para_valor_vazio():
    assert math.isnan(parse_number(""))


def test_deve_retornar_nan_para_null():
    assert math.isnan(parse_number(None))


# Testes da função yes()

def test_deve_reconhecer_sim():
    assert yes("sim") is True


def test_deve_reconhecer_yes_em_maiusculo():
    assert yes("YES") is True


def test_deve_reconhecer_true():
    assert yes("true") is True


def test_deve_retornar_false_para_nao():
    assert yes("não") is False


# Testes da função parse_pressure()

def test_deve_extrair_pressao_sistolica():
    assert parse_pressure("120/80") == 120


def test_deve_extrair_numero_de_texto():
    assert parse_pressure("Pressão: 140") == 140


def test_deve_converter_pressao_com_decimal():
    assert parse_pressure("120,5/80") == 120.5


def test_deve_retornar_nan_para_texto_sem_numeros():
    assert math.isnan(parse_pressure("sem dados"))


# Testes da função normalize_key()

def test_deve_converter_letras_para_minusculas():
    assert normalize_key("AGE") == "age"


def test_deve_remover_espacos_e_simbolos():
    assert normalize_key("Heart Attack!") == "heartattack"


def test_deve_remover_acentos():
    assert normalize_key("Pressão") == "pressao"


def test_deve_retornar_vazio_para_null():
    assert normalize_key(None) == ""


# Testes da função get_value()

def test_deve_encontrar_valor_usando_nome_equivalente():
    assert get_value({"Age": 45}, ["age"]) == 45


def test_deve_encontrar_coluna_mesmo_com_acentos():
    assert get_value({"Pressão": 120}, ["pressao"]) == 120


def test_deve_buscar_usando_lista_de_nomes_possiveis():
    assert get_value({"idade": 30}, ["age", "idade"]) == 30


def test_deve_retornar_vazio_quando_coluna_nao_existe():
    assert get_value({"Age": 45}, ["peso"]) == ""


def test_deve_retornar_vazio_quando_objeto_nao_possui_colunas_correspondentes():
    assert get_value({}, ["age"]) == ""


def test_deve_respeitar_o_valor_zero_da_coluna():
    assert get_value({"Age": 0}, ["age"]) == 0


# Testes da função normalize_rows()

def test_deve_normalizar_idade_e_colesterol_para_numeros():
    result = normalize_rows([
        {"Age": "45", "Cholesterol": "230"}
    ])

    assert result[0]["Age"] == 45
    assert result[0]["Cholesterol"] == 230


def test_deve_reconhecer_nomes_alternativos_das_colunas():
    result = normalize_rows([
        {"Idade": "50", "Colesterol": "190", "Sexo": "Female"}
    ])

    assert result[0]["Age"] == 50
    assert result[0]["Cholesterol"] == 190
    assert result[0]["Sex"] == "Female"


def test_deve_manter_demais_dados_do_registro():
    result = normalize_rows([
        {
            "Age": "40",
            "Diabetes": "Yes",
            "Smoking": "No",
            "Obesity": "Yes"
        }
    ])

    assert result[0]["Diabetes"] == "Yes"
    assert result[0]["Smoking"] == "No"
    assert result[0]["Obesity"] == "Yes"


def test_deve_remover_registro_completamente_vazio():
    result = normalize_rows([{}])

    assert len(result) == 0


def test_deve_manter_registro_com_idade_zero():
    result = normalize_rows([
        {"Age": "0"}
    ])

    assert len(result) == 1
    assert result[0]["Age"] == 0


def test_deve_retornar_lista_vazia_quando_nao_recebe_registros():
    result = normalize_rows([])

    assert result == []


# Testes da função parse_csv()

def test_deve_interpretar_csv_separado_por_virgulas():
    csv = "Age,Sex\n45,Male"

    result = parse_csv(csv)

    assert result == [
        {"Age": "45", "Sex": "Male"}
    ]


def test_deve_interpretar_csv_separado_por_ponto_e_virgula():
    csv = "Age;Sex\n50;Female"

    result = parse_csv(csv)

    assert result == [
        {"Age": "50", "Sex": "Female"}
    ]


def test_deve_retornar_lista_vazia_para_texto_invalido():
    assert parse_csv("") == []
    assert parse_csv(None) == []


def test_deve_retornar_lista_vazia_quando_ha_apenas_cabecalho():
    assert parse_csv("Age,Sex,Cholesterol") == []


def test_deve_preservar_virgula_dentro_de_campo_entre_aspas():
    csv = 'City,Age\n"Recife, PE",25'

    result = parse_csv(csv)

    assert result == [
        {"City": "Recife, PE", "Age": "25"}
    ]