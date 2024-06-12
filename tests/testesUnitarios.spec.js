const { application } = require('express');
const app = require('../server');
const request = require('supertest');

let id_pedido = ""
let senha_pedido = ""

// TESTES DOS ENDPOINTS
test('Criar um pedido', async () => {
    
    // Ação do teste
    const response = await request(app)
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
    const response = await request(app)
        .get('/api/pedidos/')
        .expect('Content-type', /application\/json/);

    // Verificação do teste
    expect(response.statusCode).toEqual(200);

});

test('Obter um pedido pelo seu ID', async () => {
    
    // Ação do teste
    const response = await request(app)
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
    const response = await request(app)
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
    const responsePatch = await request(app)
        .patch('/api/pedidos/' + id_pedido)
        .send({
            "status": "2"
        });

    // Verificação do teste
    expect(responsePatch.statusCode).toEqual(201);
    expect(responsePatch.body.message).toStrictEqual(`Pedido de ID ${id_pedido} alterado com sucesso`);

    // Fazer o GET no pedido após alteração
    const response = await request(app)
        .get('/api/pedidos/' + id_pedido)
        .expect('Content-type', /application\/json/);

    // Garantir que o status foi alterado
    expect(response.body[0].status).toStrictEqual(2);

});

test('Alterar um pedido por completo', async () => {
    
    // Ação do teste
    const responsePut = await request(app)
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
    const response = await request(app)
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
    const response = await request(app)
        .delete('/api/pedidos/' + id_pedido);

    // Verificação do teste
    expect(response.statusCode).toEqual(200);    
    expect(response.body.message).toStrictEqual(`Pedido de ID ${id_pedido} excluído com sucesso`);

});