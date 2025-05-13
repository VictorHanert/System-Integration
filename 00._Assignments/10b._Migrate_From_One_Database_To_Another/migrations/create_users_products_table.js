export function up(knex) {
    return knex.schema
        .createTable('users', (table) => {
            table.increments('id');
            table.string('first_name', 255).notNullable();
            table.string('last_name', 255).notNullable();
        });
}

export function down(knex) {
    return knex.schema
        .dropTable('users');
}