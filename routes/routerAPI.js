// Utilizando o express e declarando que o modulo atual é uma rota
const express = require('express');
const routerAPI = express.Router();
// Utilizando knex para gerenciar o banco de dados
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig.development);
// Importando o arquivo responsável por salvar os logs
const logger = require('../logger');

// Processa o corpo da requisicao e insere os dados recebidos como atributos de req.body
routerAPI.use(express.json());
// Body Parser, recebe os dados do formulário e transforma o corpo obtido num formato reconhecido
routerAPI.use(express.urlencoded({ extended: true }));

/*
 *
 * ROTAS API PARA FAZER O CRUD DE PEDIDOS NA BASE, UTILIZANDO KNEX PARA GERENCIAR O BANCO DE DADOS
 * 
 */

// POST para criar um novo pedido - http://[servidor]:[porta]/api/pedidos
routerAPI.post('/pedidos', (req, res) => {
    console.log (req.body);
    knex('pedidos')
        .insert(req.body, ['id', 'senha_pedido'])
        .then((dados) => {
            if (dados.length > 0) {
                const id = dados[0].id;
                const senha_pedido = dados[0].senha_pedido;
                // Salvar o log no nível debug
                logger.debug("Pedido adicionado com sucesso. ID: " + id + "| Senha: " + senha_pedido);
                res.status(201).json( {
                    message: 'Pedido adicionado com sucesso',
                    data: { id, senha_pedido }
                });
            }
        })
    .catch((err) => {
        // Salvar o log no nível error
        logger.error("Erro ao inserir pedido");
        res.json ({ message: `Erro ao inserir pedido: ${err.message}` });
    })
});

// GET para obter todos os pedidos - http://[servidor]:[porta]/api/pedidos
routerAPI.get('/pedidos', (req, res) => {
    knex('pedidos')
    .then((dados) => {
        res.json (dados);
    }).catch((err) => {
        // Salvar o log no nível error
        logger.error("Erro ao obter os pedidos");
        res.json ({
            message: `Erro ao obter os pedidos: ${err.message}`
        });
    })
});

// GET para obter um pedido específico - http://[servidor]:[porta]/api/pedidos/[id]
routerAPI.get('/pedidos/:id', (req, res) => {
    let id = req.params.id;
    knex('pedidos').where('id', id)
        .then((dados) => {
            if (dados != ""){
                // Salvar o log no nível debug
                logger.debug("Obtendo o pedido de ID " + id);
                res.json(dados);
            } else {
                res.json({
                    message: `Pedido de ID ${id} não encontrado`
                })
            }
        })
    .catch((err) => {
        // Salvar o log no nível error
        logger.error("Erro ao obter pedido de ID " + id);
        res.json ({ message: `Erro ao obter pedido: ${err.message}` });
    })
});

// GET para obter status de um pedido - http://[servidor]:[porta]/api/senha/[senha_pedido]
routerAPI.get('/senha/:senha_pedido', (req, res) => {
    let senha_pedido = req.params.senha_pedido;
    knex('pedidos').where('senha_pedido', senha_pedido)
        .then((dados) => {
            if (dados != ""){
                // Salvar o log no nível debug
                logger.debug("Obtendo pedido de senha " + senha_pedido);
                res.json(dados);
            } else {
                res.json({
                    message: `Pedido de senha ${senha_pedido} não encontrado`
                })
            }
        })
    .catch((err) => {
        // Salvar o log no nível error
        logger.error("Erro ao obter pedido de senha " + senha_pedido);
        res.json ({ message: `Erro ao obter pedido: ${err.message}` });
    })
});

// PUT para alterar um pedido - http://[servidor]:[porta]/api/pedidos/[id]
routerAPI.put('/pedidos/:id', (req, res) => { 
    console.log (req.body);
    let id = req.params.id;
    knex('pedidos')
        .where('id', id)
        .update(req.body, ['id'])
        .then((dados) => {
            if (dados.length > 0) {
                const id = dados[0].id
                // Salvar o log no nível debug
                logger.debug(`Pedido de ID ${id} alterado`);
                res.status(201).json( {
                    message: `Pedido de ID ${id} alterado com sucesso`,
                    data: { id }});
            } else {
                res.json({
                    message: `Pedido de ID ${id} não encontrado`
                })
            }
        })
    .catch((err) => {
        // Salvar o log no nível error
        logger.error("Erro ao alterar pedido de ID " + id);
        res.json ({ message: `Erro ao alterar pedido: ${err.message}` });
    })
});

// PATCH para alterar dados específicos de um pedido - http://[servidor]:[porta]/api/pedidos/[id]
routerAPI.patch('/pedidos/:id', (req, res) => { 
    console.log (req.body);
    let id = req.params.id;
    knex('pedidos')
        .where('id', id)
        .update(req.body, ['id'])
        .then((dados) => {
            if (dados.length > 0) {
                const id = dados[0].id
                // Salvar o log no nível debug
                logger.debug(`Pedido de ID ${id} alterado`);
                res.status(201).json( {
                    message: `Pedido de ID ${id} alterado com sucesso`,
                    data: { id }});
            } else {
                res.json({
                    message: `Pedido de ID ${id} não encontrado`
                })
            }
        })
    .catch((err) => {
        // Salvar o log no nível error
        logger.error("Erro ao alterar pedido de ID " + id);
        res.json ({ message: `Erro ao alterar pedido: ${err.message}` });
    })
});

// DELETE para excluir um pedido - http://[servidor]:[porta]/api/pedidos/[id]
routerAPI.delete('/pedidos/:id', (req, res) => {
    console.log (req.body);
    let id = req.params.id;
    knex('pedidos')
        .where('id', id)
        .then((dados) => {
            if (dados != ""){
                id = dados[0].id;
                // Salvar o log no nível debug
                logger.debug(`Pedido de ID ${id} excluído`);
                knex('pedidos')
                    .where('id', id)
                    .del(req.body, ['id'])
                    .then(res.status(200).json( {
                        message: `Pedido de ID ${id} excluído com sucesso`,
                        data: { id }})
                    )
            } else {
                res.json({
                    message: `Pedido de ID ${id} não encontrado!`
                  })
            }
        })
    .catch((err) => {
        // Salvar o log no nível error
        logger.error("Erro ao excluir pedido de ID " + id);
        res.json ({ message: `Erro ao excluir pedido: ${err.message}` });
    })
});

// DELETE para excluir TODOS OS pedidos - http://[servidor]:[porta]/api/pedidos
routerAPI.delete('/pedidos', (req, res) => {
    console.log (req.body);
    knex('pedidos')
        .then((dados) => {
            if (dados != ""){
                // Salvar o log no nível debug
                logger.debug("Excluídos todos os pedidos!");
                knex('pedidos')
                    .del()
                    .then(res.status(200).json( {
                        message: `Pedidos excluídos com sucesso`})
                    )
            } else {
                res.json({
                    message: `Nenhum pedido encontrado!`
                  })
            }
        })
    .catch((err) => {
        // Salvar o log no nível error
        logger.error("Erro ao excluir os pedidos");
        res.json ({ message: `Erro ao excluir pedidos: ${err.message}` });
    })
});

// Exporta, ou seja, transforma em uma biblioteca que pode ser importada em outro codigo
module.exports = routerAPI;