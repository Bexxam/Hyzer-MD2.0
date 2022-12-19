import Connection from '../system/connection.js'
let handler = async (m, { Itsuki, args, command }) => {
    let chat = Object.keys(Connection.store.chats).filter(v => v.endsWith('g.us'))
    if (command.endsWith('all') || command.endsWith('semua')) {
        for (let id of chat) { // perulangan
            await Itsuki.groupLeave(id)
            await delay(2000) // jeda 2 detik
        }
        await m.reply('Berhasil!')
    } else if (args[0] || args.length > 5) {
        let ada = chat.find(bot => bot == args[0]) // Apakah botnya ada disitu
        if (!ada) return m.reply('Id salah/bot tidak ada digrup itu')
        await Itsuki.groupLeave(args[0])
        await m.reply('Berhasil!')
    } else {
        if (!m.isGroup) return global.dfail('group', m, Itsuki)
        await Itsuki.groupLeave(m.chat)
    }
}

handler.help = ['gc', 'gcall', 'group'].map(v => 'leave' + v)
handler.tags = ['group']
handler.command = /^leaveg(c|ro?up)(all|semua)?$/i

handler.rowner = true

export default handler

const delay = time => new Promise(res => setTimeout(res, time))
