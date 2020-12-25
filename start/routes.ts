/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import Database from '@ioc:Adonis/Lucid/Database'
import Address from 'App/Models/Address'
import District from 'App/Models/Address/District'
import Province from 'App/Models/Address/Province'
// import Address from 'App/Models/Address'

Route.get('/', async ({ request }) => {
  // SELECT name city_name, id city_id, parent_id province_id, name province_name FROM `addresses` WHERE parent_id in (select id FROM addresses)
  let s = request.all()['search'] || ''
  let data2 = await Database.query()
    .select(
      Database.raw(`
    province.name province_name,
    city.province_id,
    city.name city_name,
    city_id,
    district.id district_id,
    district.name district_name,
    postal_code
    from address_provinces
    province,
    address_cities city,
    address_districts district
    where
    (city.name like ? or
    district.name like ?)
    and
    (city.province_id = province.id and
    district.city_id = city.id)
  `, [`%${s}%`, `%${s}%`])
    )
    .limit(10)
  let data1 = await Database.query()
    .select(
      Database.raw(`
        e.name as province_name,
        e.id as province_id,
        m.name as city_name,
        m.id as city_id,
        c.name as district_name,
        c.id as district_id,
        c.zip_code
    FROM
        addresses e
    JOIN addresses m ON 
        m.parent_id = e.id
        and m.have_childs = true
    JOIN addresses c ON
      c.parent_id = m.id
        and c.have_childs = false
    WHERE c.name like ? or m.name like ?`,
      [`%${s}%`, `%${s}%`]
      )
    )
    .limit(10)
  return {
    data2,
    data1
    // total: await Databasea
  }
})
