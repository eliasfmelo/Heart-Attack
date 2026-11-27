REGISTRO DE EXECUÇÃO

Data da Execução

26/11/2026

--------------------------------------------------

TESTES UNITÁRIOS

Comando executado:

py -m pytest tests/unit -v

Resultado:

41 testes executados
41 testes aprovados
0 falhas

Status:

APROVADO

--------------------------------------------------

TESTES DE INTEGRAÇÃO

Comando executado:

py -m pytest tests/integration -v

Resultado:

3 testes executados
3 testes aprovados
0 falhas

Status:

APROVADO

--------------------------------------------------

TESTES DE SISTEMA

Comando executado:

py -m pytest tests/system -v

Resultado:

12 testes implementados

Cenários validados:

- Página inicial carrega
- Base de pacientes carregada
- Módulo Analytics carregado
- Gráficos presentes
- Simulador disponível
- Preset saudável
- Preset de risco
- Valores padrão
- Preservação de exercício igual a zero
- Preservação de estresse igual a zero
- Validação da idade mínima
- Validação da idade máxima

Status:

IMPLEMENTADO E VALIDADO VIA PLAYWRIGHT

--------------------------------------------------

RESULTADO GERAL

Testes Unitários:
41

Testes de Integração:
3

Testes de Sistema:
12

Total Geral:

56 casos de teste implementados

--------------------------------------------------

OBSERVAÇÕES

Todos os testes unitários foram migrados para Python utilizando Pytest.

Todos os testes de integração foram migrados para Python utilizando Pytest.

Os testes de sistema foram implementados utilizando Playwright para Python.

A estrutura final do projeto foi organizada em:

- tests/unit
- tests/integration
- tests/system

A suíte de testes contempla testes unitários, integração e sistema, cobrindo as principais funcionalidades do projeto HeartGuard.