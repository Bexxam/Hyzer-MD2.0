import db from '../system/database.js'

let handler = async (m, { command }) => {
    if (!m.quoted) return m.reply('Reply Pesan!')
    if (!m.quoted.fileSha256) return m.reply('SHA256 Hash Missing')
    let sticker = db.data.sticker
    let hash = m.quoted.fileSha256.toString('hex')
    if (!(hash in sticker)) return m.reply('Hash not found in database')
    sticker[hash].locked = !/^un/i.test(command)
    m.reply('Done!')
}
handler.help = ['un', ''].map(v => v + 'lockcmd')
handler.tags = ['database']
handler.command = /^(un)?lockcmd$/i

export default handler
