import db from '../system/database.js'

let handler = async (m, { Itsuki }) => {
    Itsuki.reply(m.chat, `
*DAFTAR HASH*

${Object.entries(db.data.sticker).map(([key, value], index) => `${index + 1}. ${value.locked ? `(Terkunci) ${key}` : key} : ${value.text}`).join('\n')}

`.trim(), null, {
        mentions: Object.values(db.data.sticker).map(x => x.mentionedJid).reduce((a, b) => [...a, ...b], [])
    })
}


handler.help = ['listcmd']
handler.tags = ['database']
handler.command = ['listcmd']

export default handler
