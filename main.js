process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
process.on('uncaughtException', console.error)

import Connection from './system/connection.js'
import Helper from './system/helper.js'
import db from './system/database.js'
import clearTmp from './system/clearTmp.js';
import {
  readFileSync
} from 'fs'
import {
  spawn
} from 'child_process'
import {
  protoType,
  serialize
} from './system/realize.js'
import chalk from 'chalk'
import {
  plugins,
  loadPluginFiles,
  reload,
  pluginFolder,
  pluginFilter
} from './system/plugins.js'

global.config = JSON.parse(readFileSync('./config.json'))
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()

// Assign all the value in the Helper to global
Object.assign(global, {
  ...Helper,
  timestamp: {
    start: Date.now()
  }
})

// global.opts['db'] = process.env['db']

/** @type {import('./system/connection.js').Socket} */
const Itsuki = Object.defineProperty(Connection, 'Itsuki', {
  value: await Connection.Itsuki,
  enumerable: true,
  configurable: true,
  writable: true
}).Itsuki

// load plugins
loadPluginFiles(pluginFolder, pluginFilter, {
  logger: Itsuki.logger,
  recursiveRead: false
}).then(_ => console.log(Object.keys(plugins)))
  .catch(console.error)


if (!opts['test']) {
  setInterval(async () => {
    await Promise.allSettled([
      db.data ? db.write() : Promise.reject('db.data is null'),
      (opts['autocleartmp'] || opts['cleartmp']) ? clearTmp() : Promise.resolve()
    ])
    Connection.store.writeToFile(Connection.storeFile)
  }, 60 * 1000)
}
if (opts['server']) (await import('./system/server.js')).default(Itsuki, PORT)


// Quick Test
async function _quickTest() {
  let test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version'])
  ].map(p => {
    return Promise.race([
      new Promise(resolve => {
        p.on('close', code => {
          resolve(code !== 127)
        })
      }),
      new Promise(resolve => {
        p.on('error', _ => resolve(false))
      })
    ])
  }))
  let [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
  console.log(test)
  let s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm,
    find
  }
  // require('./system/sticker').support = s
  Object.freeze(global.support)

  if (!s.ffmpeg) console.log(chalk.green('Please install ffmpeg for sending videos (pkg install ffmpeg)'))
  if (s.ffmpeg && !s.ffmpegWebp) console.log(chalk.green('Stickers may not animated without libwebp on ffmpeg (--enable-libwebp while compiling ffmpeg)'))
  if (!s.convert && !s.magick && !s.gm) console.log(chalk.green('Stickers may not work without imagemagick if libwebp on ffmpeg doesnt isntalled (pkg install imagemagick)'))
}

_quickTest()
  .then(() => console.log("√ Quick Test Success"))
  .catch(console.error)
