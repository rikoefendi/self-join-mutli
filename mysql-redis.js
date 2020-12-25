const {
  MysqlRedis,
  MysqlRedisAsync,
  Caching,
  HashTypes
} = require('mysql-redis')

const redisOptions = { host: '127.0.0.1', port: 6379 }
const mysqlOptions = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'root',
  supportBigNumbers: true,
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
  database: 'dev_gin'
}

const mysql = require('mysql2')
const pool = mysql.createPool(mysqlOptions)

const Redis = require('redis')
const redisConnection = Redis.createClient(redisOptions)

const cacheOptions = {
  expiry: 2629746, // seconds, defaults to 30 days
  keyPrefix: 'test.sql.', // default
  hashType: HashTypes.farmhash32 //default
}

const mysqlRedis = new MysqlRedis(pool, redisConnection, cacheOptions)

mysqlRedis.query(
  'select * from articles',
  {
    //cache option
    keyPrefix: 'sql-abc-',
    expire: 3600,
    hashType: HashTypes.farmhash64
    //or hash: myHash <- provide your own
    // caching: Caching.SKIP or Caching.REFRESH or Caching.CACHE
  },
  (err, data, fields) => {
    console.log(data)
    // if served by Redis, fields value is something like [ { cacheHit: 'sql.Dh9VSNbN5V$' } ]
    // else mysql fields
  }
)
