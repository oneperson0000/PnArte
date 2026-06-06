# 💎 PnArte - Sistema Financeiro Empresarial

**Um sistema financeiro completo para gerenciamento empresarial de porcelanatos**

---

## 📋 Visão Geral

PnArte é um sistema financeiro moderno e responsivo desenvolvido com **HTML5, CSS3 e JavaScript puro** (sem frameworks). Toda a aplicação funciona **100% no navegador** com dados salvos localmente usando **LocalStorage**.

### ✨ Características Principais

✅ **Dashboard interativo** com gráficos em tempo real  
✅ **Controle de entradas** - registre suas receitas  
✅ **Controle de saídas** - monitore suas despesas  
✅ **Gestão de estoque** - organize seus porcelanatos  
✅ **Relatórios detalhados** - diário, semanal, mensal, anual  
✅ **Gráficos dinâmicos** - visualize seus dados  
✅ **Interface responsiva** - funciona em desktop e mobile  
✅ **Sem servidor** - dados seguros no seu navegador  

---

## 🚀 Como Usar

### 1. **Abrir a Aplicação**

Simplesmente abra o arquivo `index.html` no navegador:
```
duplo-clique em index.html
```

### 2. **Dashboard**
- Veja um resumo financeiro com:
  - Total de entradas
  - Total de saídas
  - Lucro atual
  - Gráficos de evolução

### 3. **Registrar Entradas**
- Clique em "Entradas" no menu lateral
- Clique em "Nova Entrada"
- Preencha os dados:
  - **Data**: quando recebeu
  - **Descrição**: do que se trata
  - **Cliente**: quem pagou
  - **Valor**: quanto recebeu
  - **Forma de Pagamento**: dinheiro, cartão, etc.

### 4. **Registrar Saídas**
- Clique em "Saídas" no menu lateral
- Clique em "Nova Saída"
- Preencha os dados:
  - **Data**: quando gastou
  - **Categoria**: tipo de gasto (estoque, frete, etc.)
  - **Descrição**: detalhes do gasto
  - **Valor**: quanto gastou

### 5. **Controlar Estoque**
- Clique em "Estoque" no menu lateral
- Clique em "Novo Produto"
- Registre seus porcelanatos com:
  - **Código**: identificador único (POR001)
  - **Nome**: nome do porcelanato
  - **Quantidade**: unidades disponíveis
  - **Valor de Compra**: quanto pagou
  - **Valor de Venda**: por quanto vende
- A margem de lucro é calculada automaticamente!

### 6. **Ver Relatórios**
- Clique em "Relatórios" no menu lateral
- Escolha o período: Diário, Semanal, Mensal, Anual
- Veja um resumo com todas as entradas e saídas

### 7. **Exportar Dados**
- Clique em "Exportar Dados" no rodapé do menu
- Um arquivo JSON será baixado com todos seus dados
- Guarde esse arquivo como backup!

### 8. **Limpar Tudo** ⚠️
- ⚠️ **Cuidado!** Essa ação deleta TODOS os dados
- Use apenas se tiver certeza

---

## 📁 Estrutura do Projeto

```
PnArte/
├── index.html              ← Página principal (abra aqui!)
├── README.md               ← Este arquivo
├── css/                    ← Estilos da aplicação
│   ├── style.css          ← Estilos globais
│   ├── dashboard.css      ← Estilos do dashboard
│   ├── financeiro.css     ← Estilos de entradas/saídas
│   └── estoque.css        ← Estilos do estoque
└── js/                    ← Lógica da aplicação
    ├── storage.js         ← Persistência (LocalStorage)
    ├── dashboard.js       ← Lógica do dashboard
    ├── financeiro.js      ← Lógica de entradas/saídas
    ├── estoque.js         ← Lógica do estoque
    └── app.js             ← Controlador principal
```

---

## 👨‍💻 Guia para Desenvolvedores Iniciantes

### Estrutura de Dados

#### LocalStorage
O navegador armazena dados em formato JSON:

```json
{
  "entradas": [
    {
      "id": 1717661200000,
      "data": "2026-06-06",
      "descricao": "Venda de porcelanatos",
      "cliente": "Cliente X",
      "valor": 5000,
      "formaPagamento": "dinheiro"
    }
  ],
  "saidas": [
    {
      "id": 1717661300000,
      "data": "2026-06-06",
      "categoria": "Estoque",
      "descricao": "Compra de material",
      "valor": 2000
    }
  ],
  "estoque": [
    {
      "id": 1717661400000,
      "codigo": "POR001",
      "nome": "Porcelato Marmore Branco",
      "quantidade": 100,
      "valorCompra": 50,
      "valorVenda": 100
    }
  ]
}
```

### Fluxo de Execução

```
1. Usuário abre index.html
   ↓
2. HTML carrega todos os CSS
   ↓
3. HTML carrega todos os JavaScript
   ↓
4. storage.js inicializa dados
   ↓
5. app.js inicia a aplicação
   ↓
6. Dashboard exibe dados
   ↓
7. Usuário interage (clica, digita)
   ↓
8. JavaScript processa ação
   ↓
9. storage.js salva dados
   ↓
10. UI atualiza automaticamente
```

### Entendendo o Código

#### **storage.js - O Banco de Dados**

```javascript
// Adiciona uma entrada
const entrada = {
    data: '2026-06-06',
    descricao: 'Venda',
    cliente: 'Cliente X',
    valor: 1000,
    formaPagamento: 'dinheiro'
};
storage.addEntrada(entrada);

// Pega todas as entradas
const todasEntradas = storage.getEntradas();

// Atualiza uma entrada
storage.updateEntrada(id, { valor: 2000 });

// Deleta uma entrada
storage.deleteEntrada(id);

// Calcula totais
const totais = storage.calcularTotais();
// Retorna: {
//   totalEntradas: 10000,
//   totalSaidas: 5000,
//   lucro: 5000,
//   qtdEntradas: 3,
//   qtdSaidas: 2,
//   totalMovimentacoes: 5
// }
```

#### **dashboard.js - Visualização**

```javascript
// Atualiza todos os cards
dashboard.atualizarCards();

// Renderiza gráficos
dashboard.renderizarGraficos();

// Atualiza tudo (cards + gráficos)
dashboard.atualizar();
```

#### **financeiro.js - Entradas e Saídas**

```javascript
// Renderiza tabelas
financeiro.renderizarTabelas();

// Mostra formulário de entrada
financeiro.mostrarFormularioEntrada();

// Edita uma entrada
financeiro.editarEntrada(id);

// Mostra notificação
financeiro.mostrarToast('Sucesso!', 'success');
```

#### **estoque.js - Gestão de Estoque**

```javascript
// Renderiza tabela de estoque
estoque.renderizarTabela();

// Edita um produto
estoque.editarProduto(id);

// Calcula margem de lucro
estoque.calcularMargem();
```

#### **app.js - Controlador Principal**

```javascript
// Vai para uma seção
app.irParaSecao('dashboard');
app.irParaSecao('entradas');
app.irParaSecao('saidas');
app.irParaSecao('estoque');
app.irParaSecao('relatorios');

// Exporta dados
app.exportarDados();

// Renderiza relatórios
app.renderizarRelatorios('diario');
app.renderizarRelatorios('semanal');
app.renderizarRelatorios('mensal');
app.renderizarRelatorios('anual');
```

### Modificando a Aplicação

#### **Adicionar um novo campo em Entradas**

1. **Abra `index.html`** - encontre o formulário de entrada
2. **Adicione um input:**
```html
<div class="form-group">
    <label for="entradaNovoCampo">Novo Campo</label>
    <input type="text" id="entradaNovoField" required>
</div>
```

3. **Abra `js/financeiro.js`** - na função `salvarEntrada()`
4. **Adicione o campo aos dados:**
```javascript
const dados = {
    // ... campos anteriores
    novoField: document.getElementById('entradaNovoField').value
};
```

5. **Na função `renderizarTabelaEntradas()`**, adicione a coluna na tabela:
```html
<td>${entrada.novoField}</td>
```

#### **Adicionar uma Nova Seção**

1. **Abra `index.html`**
2. **Adicione um botão no menu:**
```html
<button class="nav-btn" data-section="novaseção">
    <i class="fas fa-icon"></i>
    <span>Nova Seção</span>
</button>
```

3. **Adicione a seção HTML:**
```html
<section id="novaseção" class="section">
    <!-- Conteúdo aqui -->
</section>
```

4. **Crie um novo arquivo JavaScript** `js/novasecao.js`
5. **Abra `js/app.js`** e adicione o novo script em `index.html`:
```html
<script src="js/novasecao.js"></script>
```

### Conceitos JavaScript Utilizados

#### **Classes**
```javascript
class MinhaClasse {
    constructor() {
        this.propriedade = 'valor';
    }
    
    metodo() {
        return this.propriedade;
    }
}
```

#### **Arrow Functions**
```javascript
const funcao = (parametro) => {
    return parametro * 2;
};
```

#### **Template Strings**
```javascript
const nome = 'João';
const mensagem = `Olá, ${nome}!`;
```

#### **Event Listeners**
```javascript
botao.addEventListener('click', () => {
    console.log('Clicou!');
});
```

#### **Manipulação do DOM**
```javascript
// Pegar elemento
const elemento = document.getElementById('minhaId');

// Mudar conteúdo
elemento.textContent = 'Novo texto';
elemento.innerHTML = '<p>HTML</p>';

// Adicionar classe
elemento.classList.add('ativa');

// Remover classe
elemento.classList.remove('ativa');

// Alternar classe
elemento.classList.toggle('ativa');
```

#### **JSON**
```javascript
// Converter para JSON
const json = JSON.stringify(objeto);

// Converter de JSON
const objeto = JSON.parse(json);
```

---

## 🎨 Customizando as Cores

As cores estão definidas em `css/style.css` no ``:root``:

```css
:root {
    --color-primary: #3498db;      /* Azul - Principal */
    --color-secondary: #2ecc71;    /* Verde - Sucesso */
    --color-danger: #e74c3c;       /* Vermelho - Erro */
    --color-warning: #f39c12;      /* Laranja - Aviso */
    --color-info: #1abc9c;         /* Cyan - Info */
}
```

Mude essas cores para customizar toda a aplicação!

---

## 📱 Responsividade

A aplicação é totalmente responsiva:
- **Desktop (>1024px)**: Layout completo com sidebar
- **Tablet (768px-1024px)**: Ajustes no layout
- **Mobile (<768px)**: Menu compacto, tabelas otimizadas

---

## 🔒 Segurança

⚠️ **Importante:** Esta é uma aplicação de demonstração/aprendizado:
- Dados são salvos localmente no navegador
- Não há criptografia
- Não use para dados sensíveis
- Sempre faça backups (exportar dados)

---

## 🐛 Troubleshooting

### "Os dados desapareceram"
- LocalStorage foi limpo (cache do navegador)
- Use o backup exportado (arquivo JSON)
- Importe com a função `storage.importarDados(dados)`

### "Os gráficos não aparecem"
- Verifique se Chart.js foi carregado (CDN)
- Abra o console (F12) e veja os erros

### "Formulário não funciona"
- Verifique se todos os campos obrigatórios foram preenchidos
- Abra o console (F12) para ver mensagens de erro

---

## 📚 Recursos de Aprendizado

- **MDN Web Docs**: https://developer.mozilla.org/ - Documentação completa de JavaScript
- **CSS-Tricks**: https://css-tricks.com/ - Guias de CSS
- **JavaScript.info**: https://javascript.info/ - Tutorial interativo

---

## 📝 Licença

Este projeto é fornecido como exemplo educacional.

---

## 👨‍💼 Autor

Desenvolvido para fins educacionais - Sistema Financeiro PnArte

---

## 🆘 Precisa de Ajuda?

1. Abra o console do navegador (F12)
2. Procure por mensagens de erro (aba Console)
3. Verifique os objetos globais disponíveis:
   - `app` - controlador principal
   - `storage` - dados
   - `dashboard` - dashboard
   - `financeiro` - entradas/saídas
   - `estoque` - estoque

---

**Aproveite o PnArte! 💎**
controle de gastos empresarial 
