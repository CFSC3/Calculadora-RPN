# 🧮 Calculadora RPN (Notação Polonesa Reversa)

Uma calculadora funcional que utiliza um analisador de Notação Polonesa Reversa (RPN). O projeto demonstra a implementação de algoritmos de parsing e o uso de estruturas de dados para avaliar expressões matemáticas de forma eficiente.

## 📝 Sobre o Projeto
Este projeto foi desenvolvido para explorar conceitos avançados de ciência da computação aplicados ao desenvolvimento web. A calculadora permite que o utilizador insira expressões na notação infixa padrão (ex: `3 + 4`), convertendo-as internamente para a notação pós-fixa (RPN) através do **Algoritmo Shunting-yard**.

A principal vantagem desta abordagem é a avaliação precisa de expressões complexas, lidando com a precedência de operadores e parênteses sem ambiguidade.

## ✨ Funcionalidades
- ✅ **Conversão Infix-to-RPN:** Implementação do algoritmo Shunting-yard para transformar os tokens da expressão.
- ✅ **Avaliação com Pilha:** Uso de uma estrutura de dados do tipo Pilha (Stack) para calcular o resultado final a partir dos tokens RPN.
- ✅ **Suporte a Parênteses:** Lógica robusta para lidar com expressões agrupadas e desbalanceadas.
- ✅ **Histórico Local:** Persistência dos últimos 50 cálculos realizados utilizando `localStorage` do navegador.
- ✅ **Interface Responsiva:** Layout moderno e adaptável para diferentes tamanhos de ecrã.

## 🛠️ Tecnologias Utilizadas
- **HTML5:** Estrutura da interface e seção de histórico.
- **CSS3:** Estilização baseada em Grid e Flexbox, com efeitos de feedback visual nos botões.
- **JavaScript (ES6+):** Lógica de tokenização, parsing RPN e manipulação dinâmica do DOM.

## 📸 Demonstração
<div align="center">
  <img src="https://github.com/CFSC3/Calculadora-RPN/blob/main/img/img1.png" width="600px">
  <img src="https://github.com/CFSC3/Calculadora-RPN/blob/main/img/img2.png" width="600px">
  <img src="https://github.com/CFSC3/Calculadora-RPN/blob/main/img/img3.png" width="600px">
  <img src="https://github.com/CFSC3/Calculadora-RPN/blob/main/img/img4.png" width="600px">
</div>

## 🚀 Como Executar

Para testar a aplicação agora mesmo, basta clicar no link abaixo:

👉 **[Abrir Calculadora RPN](https://cfsc3.github.io/Calculadora-RPN/Calculadora/index.html)**

Caso queira rodar localmente:
1. Clone este repositório.
2. Abra o arquivo `index.html` no seu navegador.
