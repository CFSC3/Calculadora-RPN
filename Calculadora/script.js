
/**
 * Função principal que o botão "=" deve chamar.
 * @param {string} expressionString
 * @returns {number|string} - O resultado ou uma mensagem de erro.
 */
function calcularExpressao(expressionString) {
    try {
        // Tokenizar: Transforma a string em um array de "tokens"
        const tokens = tokenizar(expressionString);
        
        // Converter: Transforma os tokens infixos em RPN (pós-fixos)
        const rpnTokens = infixToRpn(tokens);
        
        // Avaliar: Calcula o resultado a partir dos tokens RPN
        const resultado = avaliarRpn(rpnTokens);
        
        // Arredonda resultados com muitas casas decimais
        if (String(resultado).includes('.') && String(resultado).split('.')[1].length > 8) {
            return parseFloat(resultado.toFixed(8));
        }
        
        return resultado;
    } catch (error) {
        console.error("Erro no cálculo:", error.message);
        return "Erro";
    }
}

function tokenizar(expression) {
    // Regex para encontrar números ou operadores/parênteses
    const regex = /(\d+\.?\d*|\.\d+|[+\-*/()])/g;
    
    // Insere um '0' antes de um '-' ou '+' no início (ex: -5+2 -> 0-5+2)
    const expressaoCorrigida = expression.replace(/^([+\-])/, '0$1');

    const tokens = expressaoCorrigida.match(regex);
    
    if (!tokens) {
        throw new Error("Expressão inválida");
    }
    return tokens;
}


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
            pilhaOperadores.pop();
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

// Setup Inicial
document.addEventListener('DOMContentLoaded', () => {
    
    // Lógica principal da Calculadora
    const visor = document.querySelector('.calculator-display');
    const botoes = document.querySelectorAll('.calculator-keys button');

    botoes.forEach(btn => {
        btn.addEventListener('click', () => {
            // Pega o valor do botão
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
                // Para todos os outros botões
                adicionarAoVisor(valor);
            }
        });
    });

    // Lógica do Histórico
    const btnToggleLog = document.getElementById('btn-toggle-log');
    
    if (btnToggleLog) {
        btnToggleLog.addEventListener('click', toggleLog);
    } else {
        console.warn("Elemento #btn-toggle-log não encontrado. A funcionalidade de Histórico não será iniciada.");
    }
});


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

function limparVisor() {
    const visor = document.querySelector('.calculator-display');
    visor.value = '0';
}

function calcular() {
    const visor = document.querySelector('.calculator-display');
    const expressao = visor.value;

    if (!expressao || expressao === 'Erro') return; 

    // Chama a implementação do Caminho 1
    const resultado = calcularExpressao(expressao);

    // Mostra o resultado no visor
    visor.value = resultado;

    // Chame a função de Log 
    if (String(resultado) !== "Erro") {
        salvarNoLog(expressao, resultado);
    }
}


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
        carregarLogs();
    }
}


function carregarLogs() {
    const logLista = document.getElementById('log-lista');
    if (!logLista) return;

    const logs = JSON.parse(localStorage.getItem('calculadora_logs')) || [];
    logLista.innerHTML = '';

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