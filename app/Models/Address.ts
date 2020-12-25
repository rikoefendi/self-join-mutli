import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public parentId: number
  @column()
  public name: string
  @column()
  public zip_code: Object
  @column()
  public have_childs: Boolean = false;
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
