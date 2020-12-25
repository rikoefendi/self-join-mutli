import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Province from 'App/Models/Address/Province'
import fs from 'fs'
import Bluebird from 'bluebird'
import _ from 'lodash'
import Address from 'App/Models/Address'
export default class AddressSeeder extends BaseSeeder {
  public async run () {
    const address = JSON.parse(
      fs.readFileSync(__dirname + '/address.json').toString()
    )
    let provinces = await this.create(
      address.map(e => {
        return { name: e.name, have_childs: true }
      })
    )
    await Bluebird.map(provinces, async province => {
      let cities = address.filter(e => e.name == province.name)[0].cities
      let citied = await this.create(
        cities.map(e => {
          return { name: e?.name, parent_id: province.id, have_childs: true }
        })
      )
      await Bluebird.map(citied, async city => {
        let districts = cities.filter(e => e.name == city.name)[0].districts
        await Address.createMany(
          districts.map(e => {
            return {
              name: e.name,
              zip_code: JSON.stringify(_.uniq(e.postal_code)),
              parent_id: city.id
            }
          })
        )
      })
    })

    await Bluebird.map(
      await Province.createMany(address),
      async province => {
        let provinced = address.filter(p => p.name == province.name)[0]
        // delete provinced.districts
        await Bluebird.map(
          await province.related('cities').createMany(provinced.cities),
          async city => {
            let citi = provinced.cities.filter(f => f.name == city.name)[0]
            await city.related('districts').createMany(
              citi.districts.map(e => {
                e.postal_code = JSON.stringify(_.uniq(e.postal_code))
                return e
              })
            )
          }
        )
      },
      { concurrency: 1 }
    )
  }

  private create (data) {
    return Address.createMany(data)
  }
}

interface AddressData {
  name: string
  cities: []
}
