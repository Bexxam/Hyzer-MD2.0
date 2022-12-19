import { toPTT } from '../system/converter.js'

let handler = async (m, { Itsuki, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
    if (!/video|audio/.test(mime)) return m.reply(`Reply video/audio you want to convert to voice note/vn with caption *${usedPrefix + command}*`)
    let media = await q.download?.()
    if (!media) return m.reply('Can\'t download media')
    let audio = await toPTT(media, 'mp4')
    if (!audio.data) return m.reply('Can\'t convert media to audio')
    Itsuki.sendFile(m.chat, audio.data, 'audio.mp3', '', m, true, { mimetype: 'audio/mp4' })
}
handler.help = ['tovn (reply)']
handler.tags = ['audio']

handler.command = /^to(vn|(ptt)?)$/i

export default handler