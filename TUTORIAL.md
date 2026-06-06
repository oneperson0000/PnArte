# 🎓 TUTORIAL DETALHADO - Para Iniciantes

Bem-vindo! Este tutorial explica como o sistema funciona, linha por linha.

---

## 📖 Índice
1. [Como o Navegador Carrega Tudo](#como-o-navegador-carrega-tudo)
2. [O que é LocalStorage?](#o-que-é-localstorage)
3. [Entendendo uma Classe](#entendendo-uma-classe)
4. [O Ciclo de Vida de uma Entrada](#o-ciclo-de-vida-de-uma-entrada)
5. [Dominando o DOM](#dominando-o-dom)

---

## Como o Navegador Carrega Tudo

### Passo 1: Você abre `index.html`

```
Você duplo-clica em index.html
        ↓
Navegador abre o arquivo
        ↓
Navegador lê a tag <head>
```

### Passo 2: Carregamento do HTML

No `<head>` há:
```html
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/dashboard.css">
```

Isso significa: "Carregue esses arquivos CSS para estilizar a página"

### Passo 3: Carregamento dos Scripts

No final do `<body>` há:
```html
<script src="js/storage.js"></script>
<script src="js/dashboard.js"></script>
<script src="js/financeiro.js"></script>
<script src="js/estoque.js"></script>
<script src="js/app.js"></script>
```

Ordem é IMPORTANTE!
- `storage.js` vem PRIMEIRO (porque os outros precisam dele)
- `app.js` vem ÚLTIMO (porque usa todos os outros)

### Passo 4: Execução

```
1. Navegador executa storage.js
   └─ Cria: const storage = new Storage()
   
2. Navegador executa dashboard.js
   └─ Cria: const dashboard = new Dashboard()
   
3. Navegador executa financeiro.js
   └─ Cria: const financeiro = new Financeiro()
   
4. Navegador executa estoque.js
   └─ Cria: const estoque = new Estoque()
   
5. Navegador executa app.js
   └─ Espera por DOMContentLoaded
   └─ Cria: const app = new App()
   
✅ TUDO PRONTO!
```

---

## O que é LocalStorage?

### Conceito

LocalStorage é um "mini banco de dados" no navegador:

```javascript
// Salvar um valor
localStorage.setItem('chave', 'valor');

// Recuperar um valor
const valor = localStorage.getItem('chave');

// Deletar um valor
localStorage.removeItem('chave');

// Limpar tudo
localStorage.clear();
```

### Exemplo Prático

```javascript
// Salvar nome
localStorage.setItem('meuNome', 'João');

// Recuperar nome
console.log(localStorage.getItem('meuNome')); // "João"

// Verificar
console.log(localStorage); // Vê todos os dados
```

### JSON no LocalStorage

LocalStorage só armazena **texto**, mas usamos JSON para armazenar objetos:

```javascript
// Objeto
const pessoa = {
    nome: 'João',
    idade: 30
};

// Converter para JSON (texto)
const json = JSON.stringify(pessoa);
localStorage.setItem('pessoa', json);

// Recuperar
const json_recuperado = localStorage.getItem('pessoa');

// Converter JSON de volta para objeto
const pessoa_recuperada = JSON.parse(json_recuperado);

console.log(pessoa_recuperada.nome); // "João"
```

### Em storage.js

```javascript
// Pegar todas as entradas (recupera JSON e converte)
getEntradas() {
    const dados = localStorage.getItem(this.ENTRADAS_KEY);
    return dados ? JSON.parse(dados) : [];
}

// Salvar todas as entradas (converte para JSON)
setEntradas(entradas) {
    localStorage.setItem(this.ENTRADAS_KEY, JSON.stringify(entradas));
}
```

---

## Entendendo uma Classe

### O que é uma Classe?

Uma classe é um "molde" para criar objetos:

```javascript
// Molde
class Pessoa {
    constructor(nome, idade) {
        this.nome = nome;
        this.idade = idade;
    }
    
    apresentar() {
        return `Olá, sou ${this.nome}`;
    }
}

// Criar uma pessoa
const joao = new Pessoa('João', 30);
console.log(joao.apresentar()); // "Olá, sou João"
```

### Storage.js é uma Classe

```javascript
class Storage {
    constructor() {
        // Propriedades
        this.ENTRADAS_KEY = 'pnarte_entradas';
        this.SAIDAS_KEY = 'pnarte_saidas';
        this.ESTOQUE_KEY = 'pnarte_estoque';
        
        // Inicializa
        this.init();
    }
    
    // Método: add
    addEntrada(entrada) {
        const entradas = this.getEntradas();
        entrada.id = Date.now();
        entradas.push(entrada);
        this.setEntradas(entradas);
        return entrada;
    }
    
    // Método: get
    getEntradas() {
        const dados = localStorage.getItem(this.ENTRADAS_KEY);
        return dados ? JSON.parse(dados) : [];
    }
}

// Usar
const storage = new Storage();
storage.addEntrada({ ... });
```

### Analogia do Mundo Real

```javascript
// Uma máquina de café é como uma classe

class CafeteiraAutomatica {
    constructor() {
        this.agua = 100;
        this.cafe = 100;
    }
    
    fazerCafe() {
        if (this.agua > 0 && this.cafe > 0) {
            this.agua -= 10;
            this.cafe -= 5;
            return '☕ Café pronto!';
        }
    }
}

// Você compra uma máquina (instância)
const minhaCafeteira = new CafeteiraAutomatica();

// Você usa a máquina
console.log(minhaCafeteira.fazerCafe()); // ☕ Café pronto!
```

---

## O Ciclo de Vida de uma Entrada

Acompanhe como uma entrada é criada do zero até ser salva:

### 1. Usuário Clica em "Nova Entrada"

```html
<button id="btnNovaEntrada" class="btn-primary">
    <i class="fas fa-plus"></i> Nova Entrada
</button>
```

```javascript
// Em financeiro.js
this.btnNovaEntrada.addEventListener('click', () => {
    this.mostrarFormularioEntrada();
});
```

**O que acontece:**
- O formulário fica visível (classe `hidden` é removida)
- O foco vai para o campo de data

### 2. Usuário Preenche o Formulário

```html
<form id="formEntrada" class="form">
    <input type="date" id="entradaData">
    <input type="text" id="entradaDescricao">
    <input type="text" id="entradaCliente">
    <input type="number" id="entradaValor">
    <select id="entradaFormaPagamento">
        <option value="dinheiro">Dinheiro</option>
        <!-- etc -->
    </select>
    <button type="submit">Salvar</button>
</form>
```

**O que o usuário digita:**
- Data: `2026-06-06`
- Descrição: `Venda de porcelanatos`
- Cliente: `Cliente ABC`
- Valor: `5000`
- Forma: `dinheiro`

### 3. Usuário Clica em "Salvar"

```javascript
// Listener no formulário
this.formEntrada.addEventListener('submit', (e) => {
    this.salvarEntrada(e);
});
```

### 4. JavaScript Processa

```javascript
salvarEntrada(e) {
    e.preventDefault(); // Impede envio do formulário
    
    // Pega os valores dos inputs
    const dados = {
        data: document.getElementById('entradaData').value,
        // 2026-06-06
        
        descricao: document.getElementById('entradaDescricao').value,
        // Venda de porcelanatos
        
        cliente: document.getElementById('entradaCliente').value,
        // Cliente ABC
        
        valor: parseFloat(document.getElementById('entradaValor').value),
        // 5000 (número)
        
        formaPagamento: document.getElementById('entradaFormaPagamento').value
        // dinheiro
    };
    
    // Salva usando storage
    storage.addEntrada(dados);
    
    // Mostra mensagem
    this.mostrarToast('Entrada adicionada com sucesso!', 'success');
    
    // Fecha formulário
    this.ocultarFormularioEntrada();
    
    // Atualiza tabela
    this.renderizarTabelaEntradas();
    
    // Atualiza dashboard
    dashboard.atualizar();
}
```

### 5. storage.js Salva no LocalStorage

```javascript
addEntrada(entrada) {
    // Pega array anterior
    const entradas = this.getEntradas(); // []
    
    // Gera ID único
    entrada.id = Date.now(); // 1717661200000
    
    // Adiciona ao array
    entradas.push(entrada); // [{ id, data, descricao, ... }]
    
    // Salva no localStorage
    this.setEntradas(entradas);
    // localStorage agora contém:
    // 'pnarte_entradas': '[{ "id": 1717661200000, ... }]'
    
    return entrada;
}
```

### 6. UI Atualiza

```javascript
renderizarTabelaEntradas() {
    // Pega dados do storage
    const entradas = storage.getEntradas();
    // [{ id, data, descricao, cliente, valor, formaPagamento }]
    
    // Para cada entrada, cria uma linha da tabela
    entradas.forEach(entrada => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entrada.data}</td>
            <td>${entrada.descricao}</td>
            <td>${entrada.cliente}</td>
            <td>${formatarMoeda(entrada.valor)}</td>
            <td><span class="badge">${entrada.formaPagamento}</span></td>
            <td>
                <button onclick="financeiro.editarEntrada(${entrada.id})">✎</button>
                <button onclick="financeiro.confirmarDeleteEntrada(${entrada.id})">🗑</button>
            </td>
        `;
        this.tabelaEntradas.appendChild(row);
    });
}
```

### 7. Dashboard Atualiza

```javascript
atualizar() {
    // Pega totais
    const totais = storage.calcularTotais();
    // {
    //   totalEntradas: 5000,
    //   totalSaidas: 0,
    //   lucro: 5000,
    //   ...
    // }
    
    // Atualiza cards
    this.atualizarCards();
    
    // Renderiza gráficos
    this.renderizarGraficos();
}
```

### 8. Pronto! 🎉

- ✅ Dados salvos no navegador
- ✅ Tabela atualizada
- ✅ Dashboard atualizado
- ✅ Gráficos atualizados

---

## Dominando o DOM

### O que é DOM?

DOM = **Document Object Model** = A página HTML representada como uma árvore de objetos.

```html
<!-- HTML -->
<div id="mensagem">
    Olá mundo
</div>
```

```javascript
// DOM
const elemento = document.getElementById('mensagem');
elemento.textContent = 'Novo texto';
```

### Seletores

```javascript
// Por ID (único)
document.getElementById('meuId');

// Por classe (vários)
document.getElementsByClassName('minha-classe');

// Por seletor CSS (qualquer um)
document.querySelector('#id'); // ID
document.querySelector('.classe'); // Classe
document.querySelector('button'); // Tag
document.querySelectorAll('.classe'); // Vários

// Exemplos práticos
document.getElementById('entradaData'); // Input de data
document.querySelector('.btn-primary'); // Botão azul
document.querySelectorAll('tr'); // Todas as linhas de tabela
```

### Modificar Conteúdo

```javascript
const elemento = document.getElementById('meuId');

// Texto
elemento.textContent = 'Novo texto';

// HTML
elemento.innerHTML = '<p>Novo <strong>HTML</strong></p>';

// Atributo
elemento.setAttribute('data-id', '123');

// Classe
elemento.classList.add('ativa'); // Adiciona
elemento.classList.remove('ativa'); // Remove
elemento.classList.toggle('ativa'); // Alterna
```

### Criar Elementos

```javascript
// Criar novo elemento
const novaLinha = document.createElement('tr');
novaLinha.innerHTML = `
    <td>Dados</td>
    <td>Aqui</td>
`;

// Adicionar ao DOM
const tabela = document.getElementById('minhaTabela');
tabela.appendChild(novaLinha);
```

### Eventos

```javascript
// Clicar
botao.addEventListener('click', () => {
    console.log('Clicou!');
});

// Digitar
input.addEventListener('change', () => {
    console.log('Mudou!');
});

// Enviar formulário
formulario.addEventListener('submit', (e) => {
    e.preventDefault(); // Não atualiza página
    console.log('Enviou!');
});

// Digitar em tempo real
input.addEventListener('input', () => {
    console.log('Digitando...');
});
```

### Exemplo Completo

```javascript
// HTML
<input type="text" id="nome">
<button id="btn">Enviar</button>
<div id="resultado"></div>

// JavaScript
const inputNome = document.getElementById('nome');
const botao = document.getElementById('btn');
const resultado = document.getElementById('resultado');

botao.addEventListener('click', () => {
    const nome = inputNome.value; // Pega valor
    const mensagem = `Olá, ${nome}!`;
    resultado.textContent = mensagem; // Exibe
    inputNome.value = ''; // Limpa
});
```

---

## 🎯 Próximos Passos

1. **Abra o Console** (F12 → Console)
2. **Digite:** `storage.getEntradas()`
3. **Veja:** seus dados em JSON
4. **Brinque:** tente `dashboard.atualizar()`
5. **Explore:** procure por `console.log()` no código

---

## 📚 Recursos

- **MDN DOM**: https://developer.mozilla.org/pt-BR/docs/Web/API/Document_Object_Model
- **W3Schools JS**: https://www.w3schools.com/js/
- **JavaScript Info**: https://javascript.info/dom

---

**Feliz aprendizado! Qualquer dúvida, abra o console (F12) e explore! 🚀**