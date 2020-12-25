const fs = require('fs')
const _ = require('lodash')
let allJson = fs.readFileSync(__dirname + '/all.json').toString()

allJson = JSON.parse(allJson)
let pretties = []
let provinces = _.uniqBy(allJson, function (e) {
  return e.province
})
let cities = _.uniqBy(allJson, function (e) {
  return e.city
})
let districts = _.uniqBy(allJson, function (e) {
  return e.district
})
provinces.map(prov => {
  let citie = cities.filter(e => e.province == prov.province)
  citie = citie.map(e => {
    let b = districts.filter(b => b.city == e.city)
    b = b.map(c => {
      let code = allJson.filter(e => e.district == c.district).map(f => {
        return f.postal_code
      })
      return {
        name: c.district,
        postal_code: code
      }
    })
    return {
      name: e.city,
      districts: b
    }
  })
  pretties.push({
    name: prov.province,
    cities: citie
  })
})
console.log(pretties[0])
fs.writeFileSync('./preties.json', JSON.stringify(pretties, 0, 1))
