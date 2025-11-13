/*
 * ==========================================================
 * PARTE 1: LÓGICA RPN (CAMINHO 1 - DIY)
 * Esta é a lógica de cálculo principal exigida pelo trabalho.
 * (Copiada da especificação do trabalho)
 * ==========================================================
 */

/**
 * Função principal que o seu botão "=" deve chamar.
 * @param {string} expressionString - Ex: "2+(3*4)"
 * @returns {number|string} - O resultado ou uma mensagem de erro.
 */
function calcularExpressao(expressionString) {
    try {
        // 1. Tokenizar: Transforma a string em um array de "tokens"
        const tokens = tokenizar(expressionString);
        
        // 2. Converter: Transforma os tokens infixos em RPN (pós-fixos)
        const rpnTokens = infixToRpn(tokens);
        
        // 3. Avaliar: Calcula o resultado a partir dos tokens RPN
        const resultado = avaliarRpn(rpnTokens);
        
        // Arredonda resultados com muitas casas decimais (ex: 0.1 + 0.2)
        if (String(resultado).includes('.') && String(resultado).split('.')[1].length > 8) {
            return parseFloat(resultado.toFixed(8));
        }
        
        return resultado;
    } catch (error) {
        console.error("Erro no cálculo:", error.message);
        return "Erro"; // Retorna 'Erro' para o visor
    }
}

/**
 * Etapa 1: Tokenizar a expressão
 */
function tokenizar(expression) {
    // Regex para encontrar números (incluindo decimais) OU operadores/parênteses
    const regex = /(\d+\.?\d*|\.\d+|[+\-*/()])/g;
    
    // Insere um '0' antes de um '-' ou '+' no início (ex: -5+2 -> 0-5+2)
    const expressaoCorrigida = expression.replace(/^([+\-])/, '0$1');

    const tokens = expressaoCorrigida.match(regex);
    
    if (!tokens) {
        throw new Error("Expressão inválida");
    }
    return tokens;
}


/**
 * Etapa 2: Algoritmo Shunting-Yard (Infixo para RPN)
 */
function infixToRpn(tokens) {
    const filaSaida = [];
    const pilhaOperadores = [];
    
    const precedencia = {
        '*': 2,
        '/': 2,
        '+': 1,
        '-': 1
    };

    const isOperador = (token) => ['+', '-', '*', '/'].includes(token);
    const isNumero = (token) => !isNaN(parseFloat(token));

    for (const token of tokens) {
        if (isNumero(token)) {
            filaSaida.push(token);
        } 
        else if (isOperador(token)) {
            while (
                pilhaOperadores.length > 0 &&
                isOperador(pilhaOperadores[pilhaOperadores.length - 1]) &&
                precedencia[pilhaOperadores[pilhaOperadores.length - 1]] >= precedencia[token]
            ) {
                filaSaida.push(pilhaOperadores.pop());
            }
            pilhaOperadores.push(token);
        } 
        else if (token === '(') {
            pilhaOperadores.push(token);
        } 
        else if (token === ')') {
            while (pilhaOperadores.length > 0 && pilhaOperadores[pilhaOperadores.length - 1] !== '(') {
                filaSaida.push(pilhaOperadores.pop());
            }
            
            if (pilhaOperadores.length === 0) {
                throw new Error("Parênteses desbalanceados");
            }
            pilhaOperadores.pop(); // Descarta o "("
        }
    }

    while (pilhaOperadores.length > 0) {
        const op = pilhaOperadores.pop();
        if (op === '(') {
            throw new Error("Parênteses desbalanceados");
        }
        filaSaida.push(op);
    }
    
    return filaSaida;
}

/**
 * Etapa 3: Avaliar a expressão RPN
 */
function avaliarRpn(rpnTokens) {
    const pilha = [];

    for (const token of rpnTokens) {
        if (!isNaN(parseFloat(token))) {
            pilha.push(parseFloat(token));
        } else {
            if (pilha.length < 2) {
                throw new Error("Expressão mal formada");
            }
            const b = pilha.pop();
            const a = pilha.pop();

            switch (token) {
                case '+':
                    pilha.push(a + b);
                    break;
                case '-':
                    pilha.push(a - b);
                    break;
                case '*':
                    pilha.push(a * b);
                    break;
                case '/':
                    if (b === 0) {
                        throw new Error("Divisão por zero");
                    }
                    pilha.push(a / b);
                    break;
                default:
                    throw new Error("Operador desconhecido: " + token);
            }
        }
    }

    if (pilha.length !== 1) {
        throw new Error("Expressão mal formada");
    }
    
    return pilha[0];
}


/*
 * ==========================================================
 * PARTE 2: INTEGRAÇÃO COM O FRONT-END (ADAPTADO)
 * Lógica para conectar os botões do seu HTML às funções.
 * ==========================================================
 */

// Setup Inicial (DOMContentLoaded)
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Lógica principal da Calculadora
    const visor = document.querySelector('.calculator-display');
    const botoes = document.querySelectorAll('.calculator-keys button');

    // Adiciona um 'ouvinte' para CADA botão
    botoes.forEach(btn => {
        btn.addEventListener('click', () => {
            // Pega o valor do botão (ex: "7", "+", "C")
            const valor = btn.textContent; 

            if (btn.classList.contains('key-result')) {
                // Se for o botão '=', chama a função calcular
                calcular();
            } 
            else if (btn.classList.contains('clear')) {
                // Se for o botão 'C', chama a função limpar
                limparVisor();
            } 
            else {
                // Para todos os outros botões (números, operadores, parênteses)
                adicionarAoVisor(valor);
            }
        });
    });

    // 2. Lógica do Bônus (Log/Histórico)
    // Busca o botão de log (que você precisa adicionar ao HTML)
    const btnToggleLog = document.getElementById('btn-toggle-log');
    
    if (btnToggleLog) {
        btnToggleLog.addEventListener('click', toggleLog);
    } else {
        // Aviso caso o HTML do bônus não seja encontrado
        console.warn("Elemento #btn-toggle-log não encontrado. A funcionalidade de Histórico (Bônus) não será iniciada.");
    }
});

/**
 * Adiciona o valor do botão ao visor.
 * (Adaptado para o visor '.calculator-display')
 */
function adicionarAoVisor(valor) {
    const visor = document.querySelector('.calculator-display');
    const valorAtual = visor.value;

    // Se o visor mostrar "0" (inicial) ou "Erro", substitui o valor
    if (valorAtual === '0' || valorAtual === 'Erro') {
        // Impede adicionar operadores (exceto parênteses) se o visor for '0'
        if (valorAtual === '0' && ['/', '*', '+', '-'].includes(valor)) {
             return;
        }
        visor.value = valor;
    } else {
        // Desafio do trabalho: Impedir múltiplos pontos (ex: 2.5.3)
        if (valor === '.') {
            const partes = valorAtual.split(/[+\-*/()]/);
            const ultimoNumero = partes[partes.length - 1];
            // Se o último número já tiver um ponto, não faz nada
            if (ultimoNumero.includes('.')) {
                return;
            }
        }
        visor.value += valor; // Concatena o novo valor
    }
}

/**
 * Limpa o visor, voltando ao '0' inicial.
 * (Adaptado para o visor '.calculator-display')
 */
function limparVisor() {
    const visor = document.querySelector('.calculator-display');
    visor.value = '0'; // O padrão do seu HTML é '0'
}

/**
 * Função de Cálculo Principal (chamada pelo botão =)
 * (Adaptado para o visor '.calculator-display')
 */
function calcular() {
    const visor = document.querySelector('.calculator-display');
    const expressao = visor.value;

    if (!expressao || expressao === 'Erro') return; 

    // 1. Chama a implementação do Caminho 1
    const resultado = calcularExpressao(expressao);

    // 2. Mostra o resultado no visor
    visor.value = resultado;

    // 3. Chame a função de Log (Bônus)
    if (String(resultado) !== "Erro") {
        salvarNoLog(expressao, resultado);
    }
}


/*
 * ==========================================================
 * PARTE 3: FUNCIONALIDADE EXTRA - HISTÓRICO (SEÇÃO 4)
 * Código-fonte copiado diretamente do documento da atividade.
 * ==========================================================
 */

/**
 * Salva a expressão e o resultado no localStorage.
 */
function salvarNoLog(expressao, resultado) {
    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString('pt-BR');
    const horaFormatada = agora.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    const logEntry = `[${dataFormatada} ${horaFormatada}] ${expressao} = ${resultado}`;
    let logs = JSON.parse(localStorage.getItem('calculadora_logs')) || [];
    logs.unshift(logEntry);
    if (logs.length > 50) {
        logs.pop();
    }
    localStorage.setItem('calculadora_logs', JSON.stringify(logs));
}

/**
 * Mostra ou esconde o contêiner do log e o popula.
 */
function toggleLog() {
    const logContainer = document.getElementById('log-container');
    const btnToggleLog = document.getElementById('btn-toggle-log');

    // Se o container não existir, não faz nada.
    if (!logContainer || !btnToggleLog) return;

    const estaVisivel = logContainer.style.display === 'block';

    if (estaVisivel) {
        logContainer.style.display = 'none';
        btnToggleLog.textContent = 'Ver Histórico';
    } else {
        logContainer.style.display = 'block';
        btnToggleLog.textContent = 'Esconder Histórico';
        carregarLogs(); // Popula o log toda vez que é aberto
    }
}

/**
 * Lê os logs do localStorage e os exibe na lista <ul>.
 */
function carregarLogs() {
    const logLista = document.getElementById('log-lista');
    if (!logLista) return; // Segurança caso o HTML não exista

    const logs = JSON.parse(localStorage.getItem('calculadora_logs')) || [];
    logLista.innerHTML = ''; // Limpa a lista antiga

    if (logs.length === 0) {
        logLista.innerHTML = '<li>Nenhum histórico salvo.</li>';
        return;
    }

    logs.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = entry;
        logLista.appendChild(li);
    });
}