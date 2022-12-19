import Connection from '../system/connection.js'
import { randomBytes } from 'crypto'

let handler = async (m, { Itsuki, text }) => {
  let chats = Object.entries(Connection.store.chats).filter(([_, chat]) => chat.isChats).map(v => v[0])
  let cc = Itsuki.serializeM(text ? m : m.quoted ? await m.getQuotedObj() : false || m)
  let teks = text ? text : cc.text
  Itsuki.reply(m.chat, `_Mengirim pesan broadcast ke ${chats.length} chat_`, m)
  for (let id of chats) await Itsuki.copyNForward(id, Itsuki.cMod(m.chat, cc, /bc|broadcast/i.test(teks) ? teks : teks + '\n' + readMore + '「 ' + config.bot.name + ' All Chat Broadcast 」\n' + randomID(32)), true).catch(_ => _)
  m.reply('Selesai Broadcast All Chat :)')
}
handler.help = ['broadcast', 'bc']
handler.tags = ['owner']
handler.command = /^(broadcast|bc)$/i

handler.owner = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

const randomID = length => randomBytes(Math.ceil(length * .5)).toString('hex').slice(0, length)