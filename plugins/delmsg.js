import db from '../system/database.js'

let handler = async (m, { command, usedPrefix, text }) => {
    if (!text) throw `Gunakan *${usedPrefix}listmsg* untuk melihat daftar nya`
    let msgs = db.data.msgs
    if (!(text in msgs)) return m.reply(`'${text}' tidak terdaftar di daftar pesan`)
    delete msgs[text]
    m.reply(`Berhasil menghapus pesan di daftar pesan dengan nama '${text}'`)
}
handler.help = ['delmsg']
handler.tags = ['database']
handler.command = /^delmsg$/

export default handler
