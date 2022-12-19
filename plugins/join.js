import db from '../system/database.js'

let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})( [0-9]{1,3})?/i

let handler = async (m, { Itsuki, text, isOwner }) => {
    let [_, code, expired] = text.match(linkRegex) || []
    if (!code) return m.reply('Link invalid')
    let res = await Itsuki.groupAcceptInvite(code)
    expired = Math.floor(Math.min(999, Math.max(1, isOwner ? isNumber(expired) ? parseInt(expired) : 0 : 3)))
    m.reply(`Berhasil join grup ${res}${expired ? ` selama ${expired} hari` : ''}`)
    let chats = db.data.chats[res]
    if (!chats) chats = db.data.chats[res] = {}
    if (expired) chats.expired = + new Date() + expired * 1000 * 60 * 60 * 24
}
handler.help = ['join']
handler.tags = ['premium']

handler.command = /^join$/i

export default handler

const isNumber = (x) => (x = parseInt(x), typeof x === 'number' && !isNaN(x))