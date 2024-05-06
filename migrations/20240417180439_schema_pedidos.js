
exports.up = function (knex) {
    return knex.schema.createTable("pedidos", tbl => {
        tbl.increments('id');
        tbl.text("senha_pedido", 5).notNullable();
        // status 1 = fila de espera | 2 = em preparação | 3 = pronto | 4 = entregue
        tbl.integer("status").notNullable();
        tbl.text("itens", 500).notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("pedidos");
};
