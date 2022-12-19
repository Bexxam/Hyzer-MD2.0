import uploadFile from '../system/uploadFile.js'
import uploadImage from '../system/uploadImage.js'
import fetch from 'node-fetch'

let handler = async (m, { Itsuki, command, usedPrefix }) => { 
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) return m.reply(`Kirim foto/video yang ingin diubah ke manga / anime dengan caption *${usedPrefix}${command}* atau reply medianya`)
  let media = await q.download()
  let isTele = /image\/(png|jpe?g|gif|webp)|video\/mp4/.test(mime)
  let link = await (isTele ? uploadImage : uploadFile)(media)
  let api = "https://api.lolhuman.xyz/api/imagetoanime?apikey=SGWN&img=" + link
  Itsuki.newMessage(m.chat, { image: { url: api }}, { quoted: m })
}
handler.help = ['toanime <media>']
handler.tags = ['maker']
handler.command = /^(toanime|jadianime)$/i

export default handler