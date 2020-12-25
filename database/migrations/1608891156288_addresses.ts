import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Addresses extends BaseSchema {
  protected tableName = 'addresses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').index()
      table.integer('parent_id').unsigned().nullable().index()
      table.boolean('have_childs').defaultTo(false)
      table.string('name').notNullable()
      table.json('zip_code').nullable()
      table.timestamps(true)
      table.foreign('parent_id').references('addresses.id').onDelete('cascade').onUpdate('cascade')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
