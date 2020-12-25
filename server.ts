/*
|--------------------------------------------------------------------------
| AdonisJs Server
|--------------------------------------------------------------------------
|
| The contents in this file is meant to bootstrap the AdonisJs application
| and start the HTTP server to accept incoming connections. You must avoid
| making this file dirty and instead make use of `lifecycle hooks` provided
| by AdonisJs service providers for custom code.
|
*/

import 'reflect-metadata'
import sourceMapSupport from 'source-map-support'
import { Ignitor } from '@adonisjs/core/build/standalone'
// import cluster from 'cluster'
// import os from 'os'
// const numCpus = os.cpus().length
sourceMapSupport.install({ handleUncaughtExceptions: false })

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`)
//   for (let i = 0; i < numCpus; i++) {
//     cluster.fork()
//   }
//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`)
//   })
// } else {
  new Ignitor(__dirname).httpServer().start()
  console.log(`Worker ${process.pid} started`)
// }
