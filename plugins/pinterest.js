import { pinterest } from '../system/scraper.js'

let handler = async(m, { Itsuki, text }) => {
if (!text) return m.reply("Masukkan query yang akan dicari, contoh .pinterest loli")
await pinterest(text)
 .then(res => res.getRandom())
    .then(bf => Itsuki.newMessage(m.chat, { image: { url: bf }, caption: bf }, { quoted: m }))
}
handler.help = ['pinterest']
handler.tags = ['internet']
handler.command = /^(pin|pinterest)$/i
handler.wait = true

export default handler