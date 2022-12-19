import { lyrics, lyricsv2 } from '@bochilteam/scraper'
import { pinterest } from '../system/scraper.js'
import { getBuffer } from '../system/function.js'

let handler = async (m, { Itsuki, text, usedPrefix, command }) => {
    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : ''
    if (!teks) return m.reply('Sertakan judul lagu yang akna dicari judulnya.')
    const result = await lyricsv2(teks).catch(async _ => await lyrics(teks))
    const x = await pinterest(result.author + '-' + result.title)
    const y = x.getRandom()
    const z = await getBuffer(y)
    Itsuki.newMessage(m.chat, { 
      text: `Lyrics *${result.title}*\nAuthor ${result.author}\n\n\n${result.lyrics}\n\n\nUrl ${result.link}`,
      contextInfo: {
       externalAdReply: {
       title: result.title,
       thumbnail: z,
       mediaType: 1,
       renderLargerThumbnail: true,
       thumbnailUrl: y,
       sourceUrl: '-'
      }}}, { quoted: m })       
}

handler.help = ['lirik']
handler.tags = ['internet']
handler.command = /^(lirik|lyrics|lyric)$/i
handler.wait = true

export default handler