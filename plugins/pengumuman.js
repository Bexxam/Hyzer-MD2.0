import { generateWAMessageFromContent } from 'baileys'
let handler = async (m, { Itsuki, text, participants }) => {
  let users = participants.map(u => Itsuki.decodeJid(u.id))
  let q = m.quoted ? m.quoted : m
  let c = m.quoted ? m.quoted : m.msg
  const msg = Itsuki.cMod(m.chat,
    generateWAMessageFromContent(m.chat, {
      [c.toJSON ? q.mtype : 'extendedTextMessage']: c.toJSON ? c.toJSON() : {
        text: c || ''
      }
    }, {
      quoted: m,
      userJid: Itsuki.user.id
    }),
    text || q.text, Itsuki.user.jid, { mentions: users }
  )
  await Itsuki.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}
handler.help = ['pengumuman', 'announce', 'hidetag']
handler.tags = ['group']
handler.command = /^(pengumuman|announce|hiddentag|hidetag)$/i

handler.group = true
handler.admin = true

export default handler

