import { toAudio } from '../system/converter.js'

let handler = async (m, { Itsuki, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
    if (!/video|audio/.test(mime)) return m.reply(`Reply video/voice note you want to convert to audio/mp3 with caption *${usedPrefix + command}*`)
    let media = await q.download?.()
    if (!media) return m.reply('Can\'t download media')
    let audio = await toAudio(media, 'mp4')
    if (!audio.data) return m.reply('Can\'t convert media to audio')
    Itsuki.sendFile(m.chat, audio.data, 'audio.mp3', '', m, null, { mimetype: 'audio/mp4' })
}
handler.help = ['tomp3']
handler.tags = ['audio']

handler.command = /^to(mp3|a(udio)?)$/i

export default handler