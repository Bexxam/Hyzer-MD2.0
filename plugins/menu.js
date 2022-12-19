import db from '../system/database.js'
import { promises } from 'fs'
import { join } from 'path'
import { xpRange } from '../system/levelling.js'
import { plugins } from '../system/plugins.js'
import { getBuffer } from '../system/function.js'

let tags = {
  'main': 'MAIN',
  'sticker': 'STICKER',
  'kerang': 'KERANG AJAIB',
  'group': 'GROUP',
  'premium': 'PREMIUM',
  'internet': 'INTERNET',
  'anonymous': 'ANONYMOUS CHAT',
  'downloader': 'DOWNLOADER',
  'tools': 'TOOLS',
  'fun': 'FUN',
  'database': 'DATABASE',
  'owner': 'OWNER',
  'advanced': 'ADVANCED',
  'info': 'INFO',
  'anime': 'ANIME',
  'audio': 'AUDIO',
}
const defaultMenu = {
  before: `
Hi %name, %me Here.

• *Tanggal:* %week, %date
• *Waktu:* %time
• *Uptime:* %uptime (%muptime)
• *Database:* %rtotalreg of %totalreg

Berikut adalah keseluruhan command bot.
%readmore`.trimStart(),
  header: '*%category*',
  body: '› %cmd %islimit %isPremium',
  footer: ``,
  after: ``,
}
let handler = async (m, { Itsuki, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, limit, level, role } = db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await Itsuki.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(db.data.users).length
    let rtotalreg = Object.values(db.data.users).filter(user => user.registered == true).length
    let help = Object.values(plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    Itsuki.menu = Itsuki.menu ? Itsuki.menu : {}
    let before = Itsuki.menu.before || defaultMenu.before
    let header = Itsuki.menu.header || defaultMenu.header
    let body = Itsuki.menu.body || defaultMenu.body
    let footer = Itsuki.menu.footer || defaultMenu.footer
    let after = Itsuki.menu.after || (Itsuki.user.jid == Itsuki.user.jid ? '' : `Powered by https://wa.me/${Itsuki.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '(Limit)' : '')
                .replace(/%isPremium/g, menu.premium ? '(Premium)' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    let text = typeof Itsuki.menu == 'string' ? Itsuki.menu : typeof Itsuki.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      me: config.bot.name,
      npmname: _package.name,
      npmdesc: _package.description,
      version: _package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
      level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    const ran = config.thumbnail.random.getRandom()
    Itsuki.newMessage(m.chat, {
             image: { url: ran },
             caption: text.trim(),
             templateButtons: [
             {
             index: 1,
             urlButton: {
             displayText: `Group Official 🐾`,
             url: config.web.group
            }            
            },
             {
             index: 1,
             urlButton: {
             displayText: `Website Official 📍`,
             url: config.web.official
            }            
            },
            { quickReplyButton: { displayText: 'Speedtest 🗯️', id: `.ping` }},
            { quickReplyButton: { displayText: 'Owner 👨🏻‍💻', id: `.owner` }},
            { quickReplyButton: { displayText: 'Runtime 🕒', id: `.rt` }}
            ],
          footer: config.bot.footer
        })
    /*
    const thumb = await getBuffer(ran)    
    Itsuki.generateMessage(m.chat, { 
        text: text.trim(),
        contextInfo: {
        externalAdReply: {
         title: config.bot.footer,
         thumbnail: thumb,
         mediaType: 1,
         renderLargerThumbnail: true,
         thumbnailUrl: ran,
         sourceUrl: config.web.group
        }
        }
        }, { quoted: m })
     */
  } catch (e) {
    Itsuki.reply(m.chat, 'Maaf, menu sedang error', m)
    throw e
  }
}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(menu|help|\?)$/i

handler.exp = 3

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
