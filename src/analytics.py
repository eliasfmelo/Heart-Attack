import csv
import io
import math
import re
import unicodedata


def avg(arr):
    if not arr:
        return 0
    return sum(arr) / len(arr)


def parse_number(value):
    if value is None or value == "":
        return math.nan

    cleaned = re.sub(r"[^\d.-]", "", str(value).replace(",", "."))

    if cleaned == "":
        return math.nan

    try:
        return float(cleaned)
    except ValueError:
        return math.nan


def yes(value):
    v = str(value or "").strip().lower()
    return v in ["yes", "sim", "1", "true", "y"]


def parse_pressure(value):
    match = re.search(r"\d+(?:[.,]\d+)?", str(value or ""))

    if not match:
        return math.nan

    return parse_number(match.group())


def normalize_key(key):
    text = str(key or "").lower()

    text = unicodedata.normalize("NFD", text)
    text = "".join(
        c for c in text
        if unicodedata.category(c) != "Mn"
    )

    text = re.sub(r"[^a-z0-9]", "", text)

    return text


def get_value(row, names):
    wanted = [normalize_key(n) for n in names]

    for key in row.keys():
        if normalize_key(key) in wanted:
            return row[key]

    return ""


def _finite(value):
    return isinstance(value, (int, float)) and not math.isnan(value)


def normalize_rows(rows):
    result = []

    for r in rows:
        item = {
            "Age": parse_number(get_value(r, ["Age", "Idade"])),
            "Sex": get_value(r, ["Sex", "Sexo"]),
            "Cholesterol": parse_number(
                get_value(r, ["Cholesterol", "Colesterol"])
            ),
            "BloodPressure": get_value(
                r,
                [
                    "Blood Pressure",
                    "BloodPressure",
                    "Pressão arterial",
                    "Pressao arterial",
                ],
            ),
            "HeartRate": parse_number(
                get_value(
                    r,
                    [
                        "Heart Rate",
                        "HeartRate",
                        "Frequência cardíaca",
                        "Frequencia cardiaca",
                    ],
                )
            ),
            "Diabetes": get_value(r, ["Diabetes"]),
            "FamilyHistory": get_value(
                r,
                [
                    "Family History",
                    "Historico familiar",
                    "Histórico familiar",
                ],
            ),
            "Smoking": get_value(r, ["Smoking", "Tabagismo"]),
            "Obesity": get_value(r, ["Obesity", "Obesidade"]),
            "HeartAttackRisk": get_value(
                r,
                [
                    "Heart Attack Risk",
                    "HeartAttackRisk",
                    "Risco de Ataque Cardíaco",
                    "Risco",
                    "Heart Attack",
                ],
            ),
        }

        keep = False

        for v in item.values():
            if (
                v != ""
                and (
                    _finite(v)
                    or yes(v)
                    or (isinstance(v, str) and v.strip())
                )
            ):
                keep = True
                break

        if keep:
            result.append(item)

    return result


def parse_csv(text):
    if not text or not isinstance(text, str):
        return []

    lines = [
        line
        for line in text.splitlines()
        if line.strip()
    ]

    if len(lines) < 2:
        return []

    delimiter = ";" if ";" in lines[0] else ","

    reader = csv.DictReader(
        io.StringIO(text),
        delimiter=delimiter
    )

    return [dict(row) for row in reader]