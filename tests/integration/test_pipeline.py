from src.analytics import parse_csv, normalize_rows


def test_deve_integrar_leitura_csv_e_normalizacao_dos_pacientes():
    csv = "\n".join([
        "Age,Sex,Cholesterol,Blood Pressure,Heart Rate,Diabetes,Family History,Smoking,Obesity,Heart Attack Risk",
        "45,Male,230,120/80,80,No,No,No,No,Low",
        "60,Female,195,140/90,95,Yes,Yes,No,Yes,High"
    ])

    raw_data = parse_csv(csv)
    patients = normalize_rows(raw_data)

    assert len(raw_data) == 2
    assert len(patients) == 2

    assert patients[0]["Age"] == 45
    assert patients[0]["Cholesterol"] == 230
    assert patients[0]["BloodPressure"] == "120/80"
    assert patients[0]["HeartRate"] == 80
    assert patients[0]["HeartAttackRisk"] == "Low"

    assert patients[1]["Age"] == 60
    assert patients[1]["Cholesterol"] == 195
    assert patients[1]["HeartRate"] == 95
    assert patients[1]["HeartAttackRisk"] == "High"


def test_deve_integrar_csv_com_cabecalhos_alternativos():
    csv = "\n".join([
        "Idade;Sexo;Colesterol;Pressao arterial;Frequencia cardiaca;Risco",
        "35;Female;180;110/70;72;Low"
    ])

    patients = normalize_rows(parse_csv(csv))

    assert len(patients) == 1
    assert patients[0]["Age"] == 35
    assert patients[0]["Sex"] == "Female"
    assert patients[0]["Cholesterol"] == 180
    assert patients[0]["BloodPressure"] == "110/70"
    assert patients[0]["HeartRate"] == 72
    assert patients[0]["HeartAttackRisk"] == "Low"


def test_deve_retornar_lista_vazia_quando_csv_contem_somente_cabecalho():
    csv = "Age,Sex,Cholesterol"

    patients = normalize_rows(parse_csv(csv))

    assert patients == []