import { sticker } from '../system/sticker.js'
import uploadFile from '../system/uploadFile.js'
import uploadImage from '../system/uploadImage.js'
import { webp2png } from '../system/webp2mp4.js'

let handler = async (m, { Itsuki, args, usedPrefix, command }) => {
  let stiker = false
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime)) if ((q.msg || q).seconds > 11) return m.reply('• Durasi video maksimal 10 detik.')
      let img = await q.download?.()
      if (!img) m.reply('• Kirim atau balas gambar/video/stiker dengan perintah ' + usedPrefix + command)
      let out
      try {
        stiker = await sticker(img, false, config.sticker.packname, config.sticker.author)
      } catch (e) {
        console.error(e)
      } finally {
        if (!stiker) {
          if (/webp/g.test(mime)) out = await webp2png(img)
          else if (/video/g.test(mime)) out = await uploadFile(img)
          if (!out || typeof out !== 'string') out = await uploadImage(img)
          stiker = await sticker(false, out, config.sticker.packname, config.sticker.author)
        }
      }
    } else if (args[0]) {
      if (isUrl(args[0])) stiker = await sticker(false, args[0], config.sticker.packname, config.sticker.author)
      else return m.reply('• Link yang kamu berikan tidak valid.')
    }
  } catch (e) {
    console.error(e)
    if (!stiker) stiker = e
  } finally {
    if (stiker) Itsuki.sendFile(m.chat, stiker, 'sticker.webp', '', m)
    else m.reply('• Gagal dalam mengkonversi media.')
  }
}
handler.help = ['stiker', 'stikergif']
handler.tags = ['sticker']
handler.command = /^s(tic?ker)?(gif)?(wm)?$/i

export default handler

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}
