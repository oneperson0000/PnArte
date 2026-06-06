# 🏗️ ARQUITETURA DO PROJETO

Documento explicando a arquitetura técnica para desenvolvedores intermediários.

---

## 📊 Diagrama Geral

```
┌─────────────────────────────────────────────────────────────┐
│                       index.html                             │
│                    (Estrutura - HTML)                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │         CSS (Apresentação)               │
        ├─────────────────────────────────────────┤
        │ • style.css (Global)                    │
        │ • dashboard.css (Dashboard)             │
        │ • financeiro.css (Entradas/Saídas)      │
        │ • estoque.css (Estoque)                 │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │      JavaScript (Lógica & Dados)        │
        ├─────────────────────────────────────────┤
        │ storage.js ← → Browser LocalStorage     │
        │     ↓                                    │
        │ dashboard.js (Visualização + Gráficos)  │
        │ financeiro.js (CRUD Entradas/Saídas)    │
        │ estoque.js (CRUD Estoque)                │
        │     ↓                                    │
        │ app.js (Orquestrador)                    │
        └─────────────────────────────────────────┘
```

---

## 🔄 Padrão de Arquitetura

### Model View Controller (MVC)

```
USER → VIEW (HTML/CSS) → CONTROLLER (JS) → MODEL (Storage) → LocalStorage
                              ↑────────────────────────────────↓
                                      (Sincronização)
```

### Neste Projeto:

**MODEL** = `storage.js`
- Gerencia dados
- Operações CRUD
- Cálculos

**VIEW** = `index.html` + `css/`
- Interface visual
- Formulários
- Tabelas

**CONTROLLER** = `dashboard.js`, `financeiro.js`, `estoque.js`, `app.js`
- Lógica da aplicação
- Manipula DOM
- Chama storage
- Renderiza views

---

## 📦 Dependências Entre Módulos

```
index.html
    ↓
    ├─ CSS files
    │   ├─ style.css (variáveis globais)
    │   ├─ dashboard.css (depende de style.css)
    │   ├─ financeiro.css (depende de style.css)
    │   └─ estoque.css (depende de style.css)
    │
    └─ JS files
        ├─ storage.js (sem dependências)
        │   ↓
        ├─ dashboard.js (depende de storage.js)
        │   ↓
        ├─ financeiro.js (depende de storage.js)
        │   ↓
        ├─ estoque.js (depende de storage.js)
        │   ↓
        └─ app.js (depende de storage.js, dashboard.js, 
                   financeiro.js, estoque.js)
```

---

## 🔐 Persistência de Dados

### Fluxo de Salvamento

```
User Input (Formulário)
        ↓
JavaScript Event (addEventListener)
        ↓
Controller (salvarEntrada, salvarSaida, etc)
        ↓
Storage.add/update/delete
        ↓
JSON.stringify
        ↓
localStorage.setItem
        ↓
LocalStorage (Banco de Dados do Navegador)
```

### Fluxo de Leitura

```
Page Load / User Action
        ↓
Controller (renderizarTabela)
        ↓
Storage.get (getEntradas, getSaidas, etc)
        ↓
localStorage.getItem
        ↓
JSON.parse
        ↓
Array de Objetos
        ↓
forEach / map
        ↓
Renderizar DOM
        ↓
User vê dados
```

---

## 🎯 Responsabilidades de Cada Módulo

### storage.js
```javascript
class Storage {
    // Operações com Entradas
    addEntrada(dados)           // CREATE
    getEntradas()               // READ
    getEntradaById(id)          // READ (Um)
    updateEntrada(id, dados)    // UPDATE
    deleteEntrada(id)           // DELETE
    
    // Operações com Saídas
    addSaida(dados)
    getSaidas()
    getSaidaById(id)
    updateSaida(id, dados)
    deleteSaida(id)
    
    // Operações com Estoque
    addProduto(dados)
    getEstoque()
    getProdutoById(id)
    updateProduto(id, dados)
    deleteProduto(id)
    
    // Utilitários
    calcularTotais()            // Calcula somas
    exportarDados()             // JSON para download
    importarDados(dados)        // Restaura backup
    limparTudo()                // Delete all
    getEstatisticasCategorias() // Agrupa por categoria
    getEntradasPeriodo(i, f)    // Filtra por data
    getSaidasPeriodo(i, f)      // Filtra por data
}
```

### dashboard.js
```javascript
class Dashboard {
    // Cards
    atualizarCards()           // Atualiza totalizadores
    atualizarResumoFinanceiro()// Resumo simplificado
    
    // Gráficos
    renderizarChartComparacao()   // Bar chart
    renderizarChartLucro()        // Line chart
    renderizarChartGastos()       // Pie chart
    renderizarGraficos()          // Todos
    
    // Processamento
    getDadosEvolucaoLucro()    // Processa para gráfico
    getDadosGastosPorCategoria()
    
    // Principal
    atualizar()                // Atualiza tudo
}
```

### financeiro.js
```javascript
class Financeiro {
    // Entradas
    mostrarFormularioEntrada()
    ocultarFormularioEntrada()
    salvarEntrada(e)
    editarEntrada(id)
    confirmarDeleteEntrada(id)
    renderizarTabelaEntradas()
    
    // Saídas
    mostrarFormularioSaida()
    ocultarFormularioSaida()
    salvarSaida(e)
    editarSaida(id)
    confirmarDeleteSaida(id)
    renderizarTabelaSaidas()
    
    // Auxiliar
    renderizarTabelas()
    confirmarDelecao()
    cancelarDelecao()
    mostrarToast(msg, tipo)
}
```

### estoque.js
```javascript
class Estoque {
    // Formulário
    mostrarFormulario()
    ocultarFormulario()
    
    // CRUD
    salvarProduto(e)
    editarProduto(id)
    confirmarDeleteProduto(id)
    
    // Visualização
    renderizarTabela()
    calcularMargem()
    
    // Auxiliar
    confirmarDelecao()
    cancelarDelecao()
    mostrarToast(msg, tipo)
}
```

### app.js
```javascript
class App {
    // Navegação
    irParaSecao(nome)          // Muda de aba
    atualizarHeader(secao)     // Atualiza título
    
    // Dados
    exportarDados()            // Gera download
    pedirConfirmacaoLimpeza()  // Modal
    executarOperacaoPendente() // Confirma ação
    
    // Relatórios
    filtrarRelatorio(btn)
    renderizarRelatorios(periodo)
    
    // Utilitário
    mostrarToast(msg, tipo)
    formatarData(data)
    fecharModal()
    inicializarEventos()
}
```

---

## 🔄 Ciclos de Sincronização

### Ciclo 1: Criar Entrada

```
1. Usuário clica "Nova Entrada"
   → financeiro.mostrarFormularioEntrada()
   
2. Usuário preenche e envia
   → financeiro.formEntrada.addEventListener('submit')
   → financeiro.salvarEntrada()
   
3. Salva no storage
   → storage.addEntrada(dados)
   → localStorage.setItem()
   
4. Atualiza UI
   → financeiro.renderizarTabelaEntradas()
   → dashboard.atualizar()
   
5. Pronto ✓
```

### Ciclo 2: Inicialização da Página

```
1. Página carrega
   → DOMContentLoaded event
   
2. Cria instâncias
   → new Storage()
   → new Dashboard()
   → new Financeiro()
   → new Estoque()
   → new App()
   
3. App.js inicializa
   → app.inicializarEventos()
   → app.irParaSecao('dashboard')
   
4. Dashboard renderiza
   → dashboard.atualizar()
   → dashboard.atualizarCards()
   → dashboard.renderizarGraficos()
   
5. Dados exibidos ✓
```

---

## 🏃 Performance

### Otimizações Implementadas

1. **Event Delegation** (não usado aqui, mas possível)
   - Reduz listeners
   
2. **Cache de Elementos**
   ```javascript
   // Bom ✓
   this.btnNovaEntrada = document.getElementById('btnNovaEntrada');
   this.btnNovaEntrada.addEventListener('click', ...);
   
   // Ruim ✗
   document.getElementById('btnNovaEntrada').addEventListener('click', ...);
   ```

3. **Destruição de Gráficos**
   ```javascript
   if (this.chartComparacao) {
       this.chartComparacao.destroy(); // Libera memória
   }
   ```

4. **Filtros de Data**
   ```javascript
   // Mais rápido que processar tudo
   storage.getEntradasPeriodo(dataInicio, dataFim)
   ```

---

## 🔒 Tratamento de Erros

### Validações em storage.js

```javascript
getProdutoById(id) {
    const estoque = this.getEstoque();
    return estoque.find(p => p.id === id) || null;
    // Retorna null se não encontrar
}

updateEntrada(id, novosDados) {
    const index = entradas.findIndex(e => e.id === id);
    
    if (index !== -1) {
        // Só atualiza se encontrou
        entradas[index] = { ...entradas[index], ...novosDados, id };
        this.setEntradas(entradas);
        return entradas[index];
    }
    return null; // Retorna null se não encontrou
}
```

### Validações em financeiro.js

```javascript
salvarEntrada(e) {
    e.preventDefault(); // Impede envio do formulário
    
    // Pega valores (HTML valida required)
    const dados = { ... };
    
    const id = document.getElementById('entradaId').value;
    
    // Se tem ID, edita; senão, adiciona
    if (id) {
        storage.updateEntrada(parseInt(id), dados);
    } else {
        storage.addEntrada(dados);
    }
    
    // Atualiza UI
    this.renderizarTabelaEntradas();
    dashboard.atualizar();
}
```

### Validações em estoque.js

```javascript
salvarProduto(e) {
    e.preventDefault();
    
    const dados = { ... };
    
    // Validação customizada
    if (dados.valorVenda < dados.valorCompra) {
        this.mostrarToast('Valor de venda não pode ser menor que compra!', 'error');
        return; // Sai da função
    }
    
    // Prossegue com salvamento
    ...
}
```

---

## 🧩 Padrões de Codificação

### Nomenclatura

```javascript
// Variáveis: camelCase
const nomeDoCliente = 'João';
const totalEntradas = 1000;

// Classes: PascalCase
class Storage { }
class Dashboard { }

// Constantes: UPPER_SNAKE_CASE
const ENTRADAS_KEY = 'pnarte_entradas';
const MAX_ITEMS = 100;

// Métodos: verboCamelCase
getEntradas()
addEntrada()
updateEntrada()
deleteEntrada()
```

### Comentários

```javascript
/**
 * Descrição da função
 * @param {tipo} parametro - Descrição
 * @returns {tipo} Descrição do retorno
 */
function minhaFuncao(parametro) {
    // Comentários no código explicam o "POR QUÊ", não o "O QUÊ"
    
    if (parametro) {
        // Lógica aqui
    }
}
```

---

## 🔌 Extensibilidade

### Adicionar Novo Módulo

```javascript
// 1. Criar js/vendas.js

class Vendas {
    constructor() {
        this.formVenda = document.getElementById('formVenda');
        this.btnNovaVenda = document.getElementById('btnNovaVenda');
        this.tabelaVendas = document.getElementById('tabelaVendas').getElementsByTagName('tbody')[0];
        
        this.inicializarEventos();
        this.renderizarTabela();
    }
    
    inicializarEventos() { ... }
    mostrarFormulario() { ... }
    salvarVenda(e) { ... }
    renderizarTabela() { ... }
}

const vendas = new Vendas();

// 2. Adicionar em index.html (antes de app.js)
<script src="js/vendas.js"></script>

// 3. Adicionar em app.js
this.navButtons.push(document.querySelector('[data-section="vendas"]'));

// 4. Agora funciona!
app.irParaSecao('vendas');
```

---

## 📈 Escalabilidade

### Para Aplicação Maior

1. **Backend API**
   ```javascript
   // Em vez de localStorage
   const dados = await fetch('/api/entradas');
   ```

2. **Database (SQL/NoSQL)**
   - PostgreSQL, MongoDB, etc

3. **Framework**
   - React, Vue, Angular
   - Mais código, mas mais organizado

4. **Build Tools**
   - Webpack, Vite
   - Minificação, bundling

5. **Testing**
   - Jest, Mocha
   - Testes automatizados

---

## 🎓 Aprendizados

### Conceitos Cobertos

- [x] Classes JavaScript
- [x] Closures & Escopo
- [x] Event Listeners
- [x] DOM Manipulation
- [x] LocalStorage API
- [x] JSON & Serialização
- [x] Spread Operator (...)
- [x] Arrow Functions
- [x] Template Strings
- [x] Array Methods (map, filter, reduce, forEach)
- [x] Async/Await (em Chart.js)

### Não Cobertos (Próximos Passos)

- [ ] Promises
- [ ] Módulos (import/export)
- [ ] TypeScript
- [ ] Web Components
- [ ] Service Workers (offline)

---

**Documentação de Arquitetura Completa! 🏛️**