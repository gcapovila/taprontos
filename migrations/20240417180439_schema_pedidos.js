
exports.up = function (knex) {
    return knex.schema
        .createTable("pedidos", tbl => {
            tbl.increments('id');
            tbl.text("senha_pedido", 5).notNullable();
            // status 1 = fila de espera | 2 = em preparação | 3 = pronto | 4 = entregue
            tbl.integer("status").notNullable();
            tbl.text("itens", 500).notNullable();
        })
        .createTable("usuarios", tbl => {
            tbl.increments('id');
            tbl.string("nome").notNullable();
            tbl.string("email").notNullable().unique();
            tbl.string("senha").notNullable();
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists("pedidos")
        .dropTableIfExists("usuarios");
};
