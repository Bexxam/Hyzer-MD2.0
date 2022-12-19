import db from '../system/database.js'
import { getBuffer } from '../system/function.js'

export function before(m) {
    let user = db.data.users[m.sender]
    let end = getBuffer('https://telegra.ph/file/adb9f269739d950669a83.jpg')
    if (user.afk > -1) {
    this.generateMessage(m.chat, {
        text: `Kamu berhenti *AFK*${user.afkReason ? ' setelah ' + user.afkReason : ''} selama ${(new Date - user.afk).toTimeString()}`,
        contextInfo: {
          externalAdReply: {
          title: 'BACK AFTER AFK',
          thumbnail: end,
          thumbnailUrl: 'https://telegra.ph/file/adb9f269739d950669a83.jpg',
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: '-'
          }
       }}, { quoted: m })
       user.afk = -1
       user.afkReason = ''
    }
    let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
    let tag = getBuffer('https://telegra.ph/file/a1a160b713fe425d1b32f.jpg')
    for (let jid of jids) {
        let user = db.data.users[jid]
        if (!user)
            continue
        let afkTime = user.afk
        if (!afkTime || afkTime < 0)
            continue
        let reason = user.afkReason || ''
        this.generateMessage(m.chat, {
             text: `Jangan tag dia!\nDia sedang AFK ${reason ? 'dengan alasan ' + reason : 'tanpa alasan'}\nSelama ${(new Date - afkTime).toTimeString()}`,
             contextInfo: {
               externalAdReply: {
               title: 'AFK TIME',
               thumbnail: tag,
               thumbnailUrl: 'https://telegra.ph/file/a1a160b713fe425d1b32f.jpg',
               mediaType: 1,
               renderLargerThumbnail: true,
               sourceUrl: '-'
           }}}, { quoted: m })
    }
    return true
}
