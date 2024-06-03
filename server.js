
const express = require('express');
const app = express();
// Importando a rota criada em routes, arquivo routerAPI.js (e reaproveita o codigo deste arquivo)
const routerAPI = require('./routes/routerAPI');
// Importa o módulo path para concatenar caminhos nas URLs
const path = require('path');
// Modulo para ler o arquivo .env
require('dotenv').config();

// Sempre que eu acessar esta rota , vai abrir o 'index.html' da pasta pages
app.use('/', express.static(path.join(__dirname, '/pages')));

// Mapeando as demais telas
app.use('/lista_pedidos', express.static(path.join(__dirname, '/pages/lista_pedidos.html')));
app.use('/altera_status', express.static(path.join(__dirname, '/pages/altera_status.html')));
app.use('/incluir_pedido', express.static(path.join(__dirname, '/pages/inclui_pedido.html')));
app.use('/mostra_qrCode', express.static(path.join(__dirname, '/pages/mostra_qrCode.html')));
app.use('/busca_senha', express.static(path.join(__dirname, '/pages/busca_senha.html')));
app.use('/aguarda_senha', express.static(path.join(__dirname, '/pages/aguarda_senha.html')));

// Configurando rota que sera chamada ao acessar o caminho /api
// Tudo que for chamado em /api vai chamar o codigo que esta na rota importada
app.use ('/api', routerAPI);

// Retorno caso chamada uma URL inexistente
app.use((req, res) => {    
    res.status(404);
    res.send('Recurso solicitado não existe');
})

/* O servidor local e a porta ficam armazenados como variavel de ambiente no arquivo .env
 * IMPORTANTE: no repl.it, tem que ir no menu lateral esquerdo e clicar em Secrets, pois ele não permite criar o .env

 * O codigo abaixo vai ler o arquivo '.env'. Para que isso seja possivel, é necessario
 * Rodar o comando 'npm install dotenv', e fazer o require para este modulo no comeco deste codigo */
                       
const port = process.env.PORT
const servidor = process.env.LOCAL_HOST


app.listen(port, function () {
    console.log(`Servidor rodando em http://${servidor}:${port}`);
});
