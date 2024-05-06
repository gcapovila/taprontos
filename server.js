
const express = require('express');
const app = express();
// Importando a rota criada em routes, arquivo routerAPI.js (e reaproveita o codigo deste arquivo)
const routerAPI = require('./routes/routerAPI');
// Importa o módulo path para concatenar caminhos nas URLs
const path = require('path');

// Sempre que eu acessar esta rota , vai abrir o 'index.html' da pasta pages
app.use('/', express.static(path.join(__dirname, '/pages')));

// Mapeando as demais telas
app.use('/lista_pedidos', express.static(path.join(__dirname, '/pages/lista_pedidos.html')));
app.use('/altera_status', express.static(path.join(__dirname, '/pages/altera_status.html')));
app.use('/incluir_pedido', express.static(path.join(__dirname, '/pages/inclui_pedido.html')));
app.use('/mostra_qrCode', express.static(path.join(__dirname, '/pages/mostra_qrCode.html')));
app.use('/busca_senha', express.static(path.join(__dirname, '/pages/cliente/busca_senha.html')));

// Configurando rota que sera chamada ao acessar o caminho /api
// Tudo que for chamado em /api vai chamar o codigo que esta na rota importada
app.use ('/api', routerAPI);

// Retorno caso chamada uma URL inexistente
app.use((req, res) => {    
    res.status(404);
    res.send('Recurso solicitado não existe');
})

// Configurando porta e IP do servidor
const port = 3000
const servidor = '127.0.0.1'
app.listen(port, function () {
    console.log(`Servidor rodando em http://${servidor}:${port}`);
});
