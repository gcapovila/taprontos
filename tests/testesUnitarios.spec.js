const { application } = require('express');
const server = require('../server');
const request = require('supertest');
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig.development);

afterAll(async () => {
    await server.closeServer();// Fecha o servidor após os testes
    await knex.destroy(); // Fecha a conexão do Knex após os testes
});

let id_pedido = ""
let senha_pedido = ""

// TESTES DOS ENDPOINTS
test('Criar um pedido', async () => {
    
    // Ação do teste
    const response = await request(server)
        .post('/api/pedidos/')
        .send({
            "senha_pedido": "9999",
            "status": "1",
            "itens": "Coca-Cola teste"
        });

    // Verificação do teste
    expect(response.statusCode).toEqual(201);    
    expect(response.body.message).toStrictEqual('Pedido adicionado com sucesso');

    id_pedido = await response.body.data.id;
    senha_pedido = await response.body.data.senha_pedido;

});


test('Obter todos os pedidos', async () => {
    
    // Ação do teste
    const response = await request(server)
        .get('/api/pedidos/')
        .expect('Content-type', /application\/json/);

    // Verificação do teste
    expect(response.statusCode).toEqual(200);

});

test('Obter um pedido pelo seu ID', async () => {
    
    // Ação do teste
    const response = await request(server)
        .get('/api/pedidos/' + id_pedido)
        .expect('Content-type', /application\/json/);

    // Verificação do teste
    expect(response.statusCode).toEqual(200);
    
    // Garantir que reotrnou o pedido desejado
    expect(response.body[0]).toStrictEqual(expect.objectContaining({
        "id": id_pedido ,
        "senha_pedido": "9999",
        "status": 1,
        "itens": "Coca-Cola teste"
    }));

});

test('Obter um pedido pela sua senha', async () => {
    
    // Ação do teste
    const response = await request(server)
        .get('/api/senha/' + senha_pedido)
        .expect('Content-type', /application\/json/);

    // Verificação do teste
    expect(response.statusCode).toEqual(200);
    
    // Garantir que reotrnou o pedido desejado
    expect(response.body[0]).toStrictEqual(expect.objectContaining({
        "id": id_pedido ,
        "senha_pedido": "9999",
        "status": 1,
        "itens": "Coca-Cola teste"
    }));

});

test('Alterar o status de um pedido', async () => {
    
    // Ação do teste
    const responsePatch = await request(server)
        .patch('/api/pedidos/' + id_pedido)
        .send({
            "status": "2"
        });

    // Verificação do teste
    expect(responsePatch.statusCode).toEqual(201);
    expect(responsePatch.body.message).toStrictEqual(`Pedido de ID ${id_pedido} alterado com sucesso`);

    // Fazer o GET no pedido após alteração
    const response = await request(server)
        .get('/api/pedidos/' + id_pedido)
        .expect('Content-type', /application\/json/);

    // Garantir que o status foi alterado
    expect(response.body[0].status).toStrictEqual(2);

});

test('Alterar um pedido por completo', async () => {
    
    // Ação do teste
    const responsePut = await request(server)
        .put('/api/pedidos/' + id_pedido)
        .send({
            "senha_pedido": "9998",
            "status": "3",
            "itens": "Fanta teste"
        });

    // Verificação do teste
    expect(responsePut.statusCode).toEqual(201);    
    expect(responsePut.body.message).toStrictEqual(`Pedido de ID ${id_pedido} alterado com sucesso`);

    // Fazer o GET no pedido após alteração
    const response = await request(server)
        .get('/api/pedidos/' + id_pedido)
        .expect('Content-type', /application\/json/);

    // Garantir que reotrnou o pedido com os dados alterados
    expect(response.body[0]).toStrictEqual(expect.objectContaining({
        "id": id_pedido ,
        "senha_pedido": "9998",
        "status": 3,
        "itens": "Fanta teste"
    }));

});

test('Excluir um pedido', async () => {
    
    // Ação do teste
    const response = await request(server)
        .delete('/api/pedidos/' + id_pedido);

    // Verificação do teste
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toStrictEqual(`Pedido de ID ${id_pedido} excluído com sucesso`);

});

test('Obter um pedido que não existe', async () => {
    
    // Ação do teste
    const response = await request(server)
        .get('/api/pedidos/' + id_pedido)
        .expect('Content-type', /application\/json/);
    
    // Garantir que reotrnou que o pedido nao existe
    expect(response.body.message).toStrictEqual(`Pedido de ID ${id_pedido} não encontrado`);

    // Ação do teste
    const responseSenha = await request(server)
        .get('/api/senha/' + senha_pedido)
        .expect('Content-type', /application\/json/);

    // Garantir que reotrnou que o pedido nao existe
    expect(responseSenha.body.message).toStrictEqual(`Pedido de senha ${senha_pedido} não encontrado`);
    
});

test('Alterar o status de um pedido que não existe', async () => {
    
    // Ação do teste
    const responsePatch = await request(server)
        .patch('/api/pedidos/' + id_pedido)
        .send({
            "status": "3"
        });

    // Verificação do teste
    expect(responsePatch.body.message).toStrictEqual(`Pedido de ID ${id_pedido} não encontrado`);

});

test('Alterar por completo um pedido que não existe', async () => {
    
    // Ação do teste
    const responsePut = await request(server)
        .put('/api/pedidos/' + id_pedido)
        .send({
            "senha_pedido": "9998",
            "status": "3",
            "itens": "Fanta teste"
        });

    // Verificação do teste
    expect(responsePut.body.message).toStrictEqual(`Pedido de ID ${id_pedido} não encontrado`);

});

test('Excluir um pedido que não existe', async () => {
    
    // Ação do teste
    const response = await request(server)
        .delete('/api/pedidos/' + id_pedido);

    // Verificação do teste
    expect(response.body.message).toStrictEqual(`Pedido de ID ${id_pedido} não encontrado`);

});