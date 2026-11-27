PLANO DE TESTE - HEARTGUARD

OBJETIVO

Validar o funcionamento do sistema HeartGuard, garantindo a correta leitura, tratamento e análise dos dados cardiovasculares, bem como o funcionamento do simulador de risco cardíaco.

ESCOPO

O plano contempla:

- Leitura de arquivos CSV
- Normalização dos dados
- Processamento analítico
- Integração entre módulos
- Simulador de risco cardíaco
- Interface web
- Predição de risco cardiovascular

ESTRATÉGIA DE TESTES

Os testes foram divididos em três categorias:

TESTES UNITÁRIOS

Responsáveis pela validação individual das funções do módulo Analytics.

Arquivo:
tests/unit/test_analytics.py

Resultado:
41 testes executados e aprovados.

TESTES DE INTEGRAÇÃO

Responsáveis pela validação do fluxo completo de processamento dos dados.

Fluxo validado:

CSV → Parse → Normalize

Arquivo:
tests/integration/test_pipeline.py

Resultado:
3 testes executados e aprovados.

TESTES DE SISTEMA

Responsáveis pela validação da interface e dos fluxos completos do sistema através do Playwright.

Arquivo:
tests/system/test_heartguard.py

Cenários implementados:

- Carregamento da página inicial
- Carregamento da base de pacientes
- Carregamento do módulo Analytics
- Verificação dos gráficos
- Verificação do simulador
- Simulação com preset saudável
- Simulação com preset de risco
- Aplicação de valores padrão
- Preservação de exercício igual a zero
- Preservação de estresse igual a zero
- Validação da idade mínima
- Validação da idade máxima

Resultado atual:
12 testes implementados.

FERRAMENTAS UTILIZADAS

- Python 3.15
- Pytest
- Playwright
- pytest-playwright
- pytest-cov
- JavaScript
- Node.js

RESULTADOS OBTIDOS

Testes Unitários:
41 aprovados

Testes de Integração:
3 aprovados

Testes de Sistema:
12 implementados

Total Geral:
56 casos de teste implementados

CRITÉRIOS DE APROVAÇÃO

- Validação das funções analíticas.
- Validação do processamento dos arquivos CSV.
- Validação do fluxo completo de integração.
- Validação da interface do sistema.
- Validação das regras de negócio do simulador.
- Cobertura superior ao mínimo exigido pela disciplina.

CONCLUSÃO

A suíte de testes foi migrada para Python utilizando Pytest e organizada nas categorias Unitários, Integração e Sistema. Foram implementados 56 casos de teste cobrindo as principais funcionalidades do sistema HeartGuard.