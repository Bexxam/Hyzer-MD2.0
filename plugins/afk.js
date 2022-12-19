import db from '../system/database.js'
import { getBuffer } from '../system/function.js'

const handler = async (m, { text, Itsuki }) => {
let user = db.data.users[m.sender]
let thumb = await getBuffer('https://telegra.ph/file/58d461ebdb92c9e1b793f.jpg')
Itsuki.generateMessage(m.chat, { 
          text: `@${m.sender.split('@')[0]} sekarang *AFK* ${text ? 'dengan alasan ' + text : ''}`,
          contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
             title: 'ACTIVATING AFK MODE',
             thumbnail: thumb,
             thumbnailUrl: 'https://telegra.ph/file/58d461ebdb92c9e1b793f.jpg',
             mediaType: 1,
             renderLargerThumbnail: true,
             sourceUrl: '-'
         }
     }
}, { quoted: m })
 user.afk = + new Date
 user.afkReason = text
}
handler.help = ['afk']
handler.tags = ['fun']
handler.command = /^afk$/i

export default handler