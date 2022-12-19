import { addExif } from '../system/sticker.js'


let handler = async (m, { Itsuki, text }) => {
  if (!m.quoted) return m.reply('Quoted the sticker!')
  let stiker = false
  try {
    let [packname, ...author] = text.split('|')
    author = (author || []).join('|')
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) return m.reply('Reply sticker!')
    let img = await m.quoted.download()
    if (!img) return m.reply('Reply sticker!')
    stiker = await addExif(img, packname || '', author || '')
  } catch (e) {
    console.error(e)
    if (Buffer.isBuffer(e)) stiker = e
  } finally {
    if (stiker) Itsuki.sendFile(m.chat, stiker, 'wm.webp', '', m, false, { asSticker: true })
    else return m.reply('Conversion failed')
  }
}
handler.help = ['wm']
handler.tags = ['sticker']
handler.command = /^wm$/i

export default handler
