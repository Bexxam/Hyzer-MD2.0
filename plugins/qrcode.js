
import { toDataURL } from 'qrcode'

let handler = async (m, { Itsuki, text }) => Itsuki.sendFile(m.chat, await toDataURL(text.slice(0, 2048), { scale: 8 }), 'qrcode.png', 'Here you go', m)

handler.help = ['qr','qrcode']
handler.tags = ['tools']
handler.command = /^qr(code)?$/i

export default handler