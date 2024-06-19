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

// ------------------------------------------------------
// reCAPTCHA

routerAPI.post('/captcha/', (req, res) => {

    // Código de verificação retornado ao validar o captcha na tela
    const response_key = req.body.token;
    // Chave configurada como "Chave secreta" no site do google (https://www.google.com/recaptcha/admin/)
    // Obtendo esta chave da variável de ambiente do arquivo .env
    const secret_key = process.env.RECAPTCHA_SECRET_KEY;

    // API do Google que verifica se a chave e o token obtidos são validos
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

    // Chamando a API do Google via POST
    fetch(url, {
        method: "post",
    })
    .then((response) => response.json())
    .then((google_response) => {    
        if (google_response.success == true) {
            // logger.debug("Captcha validado com sucesso");
            return res.status(200).json({ message: "Captcha validado com sucesso" });
        } else {
            logger.debug("Falha na validação do captcha na API do Google");
            return res.status(400).json( { message: "Validação no Google falhou" });
        }
    })
    .catch((error) => {
        return res.json({ error });
    });

});

// ------------------------------------------------------
// Pedidos

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
                logger.debug("Pedido adicionado com sucesso. ID: " + id + " | Senha: " + senha_pedido);
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
                    message: `Pedido de ID ${id} não encontrado`
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

// ------------------------------------------------------
// Usuário  

// GET para obter o usuário - /usuario/email
routerAPI.get('/usuarios/:email', (req, res) => {
    let email = req.params.email;
    knex('usuarios').where('email', email)
        .then((dados) => {
            if (dados != ""){
                // Salvar o log no nível debug
                //logger.debug("Tentativa de login com o usuário " + email);
                logger.debug("Acessado o usuário " + email);
                res.json(dados);
            } else {
                res.json({
                    message: `Usuário com email ${email} não encontrado`
                })
            }
        })
    .catch((err) => {
        // Salvar o log no nível error
        logger.error("Erro ao obter usuário de email " + email);
        res.json ({ message: `Erro ao localizar usuário: ${err.message}` });
    })
});

// GET para obter todos os usuários
routerAPI.get('/usuarios', (req, res) => {
    knex('usuarios')
    .then((dados) => {
        res.json (dados);
    }).catch((err) => {
        // Salvar o log no nível error
        logger.error("Erro ao obter os atendentes");
        res.json ({
            message: `Erro ao obter os atendentes: ${err.message}`
        });
    })
});

// POST para criar um novo usuario
routerAPI.post('/usuarios', (req, res) => {
    console.log (req.body);
    knex('usuarios')
        .insert(req.body, ['id', 'nome', 'email', 'senha'])
        .then((dados) => {
            if (dados.length > 0) {
                const id = dados[0].id;
                const nome = dados[0].nome;
                const email = dados[0].email;
                const senha = dados[0].senha;
                // Salvar o log no nível debug
                logger.debug("Usuário adicionado com sucesso. ID: " + id + " | Nome: " + nome + " | Email: " + email
                             // + " | Senha: " + senha + 
                             );
                res.status(201).json( {
                    message: 'Usuário adicionado com sucesso',
                    data: { id, nome, email, senha }
                });
            }
        })
    .catch((err) => {
        // Salvar o log no nível error
        logger.error("Erro ao inserir usuário");
        res.json ({ message: `Erro ao inserir usuário: ${err.message}` });
    })
});

// PATCH para alterar dados específicos do usuário
routerAPI.patch('/usuarios/:email', (req, res) => { 
    console.log (req.body);
    let email = req.params.email;
    knex('usuarios')
        .where('email', email)
        .update(req.body, ['email'])
        .then((dados) => {
            if (dados.length > 0) {
                const email = dados[0].email
                // Salvar o log no nível debug
                logger.debug(`Usuário de email ${email} alterado com sucesso`);
                res.status(201).json( {
                    message: `Usuário de email ${email} alterado com sucesso`,
                    data: { email }});
            } else {
                res.json({
                    message: `Usuário de email ${email} não encontrado`
                })
            }
        })
    .catch((err) => {
        // Salvar o log no nível error
        logger.error("Erro ao alterar usuário de email " + email);
        res.json ({ message: `Erro ao alterar usuário: ${err.message}` });
    })
});

// PUT para alterar um usuário por completo
routerAPI.put('/usuarios/:email', (req, res) => { 
    console.log (req.body);
    let email = req.params.email;
    knex('usuarios')
        .where('email', email)
        .update(req.body, ['email'])
        .then((dados) => {
            if (dados.length > 0) {
                const email = dados[0].email
                // Salvar o log no nível debug
                logger.debug(`Usuário de email ${email} alterado`);
                res.status(201).json( {
                    message: `Usuário de email ${email} alterado com sucesso`,
                    data: { email }});
            } else {
                res.json({
                    message: `Usuário de email ${email} não encontrado`
                })
            }
        })
    .catch((err) => {
        // Salvar o log no nível error
        logger.error("Erro ao alterar usuário de email " + email);
        res.json ({ message: `Erro ao alterar usuário: ${err.message}` });
    })
});

// DELETE para excluir um usuario
routerAPI.delete('/usuarios/:email', (req, res) => {
    let email = req.params.email;

    knex('usuarios')
        .where('email', email)
        .then((dados) => {
            if (dados.length > 0) {
                // Salvando o email antes de excluí-lo
                const emailExcluido = dados[0].email;

                // Excluindo o usuário com o email encontrado
                knex('usuarios')
                    .where('email', email)
                    .del()
                    .then(() => {
                        // Salvar o log no nível debug
                        logger.debug(`Usuário de email ${emailExcluido} excluído`);

                        // Responder com sucesso
                        res.status(200).json({
                            message: `Usuário de email ${emailExcluido} excluído com sucesso`,
                            data: { email: emailExcluido }
                        });
                    })
                    .catch((err) => {
                        // Salvar o log no nível error
                        logger.error(`Erro ao excluir usuário de email ${email}: ${err.message}`);
                        res.status(500).json({ message: `Erro ao excluir usuário: ${err.message}` });
                    });
            } else {
                // Se nenhum usuário foi encontrado com o email especificado
                res.status(404).json({
                    message: `Usuário de email ${email} não encontrado`
                });
            }
        })
        .catch((err) => {
            // Salvar o log no nível error
            logger.error(`Erro ao buscar usuário de email ${email}: ${err.message}`);
            res.status(500).json({ message: `Erro ao buscar usuário: ${err.message}` });
        });
});

// Exporta, ou seja, transforma em uma biblioteca que pode ser importada em outro codigo
module.exports = routerAPI;