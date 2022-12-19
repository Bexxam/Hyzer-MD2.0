const { proto } = (await import("baileys")).default
import db from "../system/database.js"

let handler = async (m, { Itsuki, command, usedPrefix, text }) => {
    let M = proto.WebMessageInfo
    if (!m.quoted) return m.reply("Balas pesan yang akan ditambahkan dalam listmsg!")
    if (!text) return m.reply("Gunakan format command diikuti text msg serta dengan membalas pesan yang akan ditambahkan\n\n*Contoh :* .addmsg Tes")
    let msgs = db.data.msgs
    if (text in msgs) return m.reply(text + " telah terdaftar didalam listmsg!")
    msgs[text] = M.fromObject(await m.getQuotedObj()).toJSON()
    m.reply(`Berhasil menambahkan pesan '${text}'\n\nAkses dengan mengetik namanya`.trim())
}
handler.help = ['msg']
handler.tags = ['database']
handler.command = /^addmsg$/

export default handler
