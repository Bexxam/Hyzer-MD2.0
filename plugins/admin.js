import { jsonformat } from '../system/function.js'

const handler = async(m, { text, Itsuki, command }) => {
let typeact = command.toLowerCase()
let users = m.mentionedJid[0] ? m.mentionedJid : m.quoted ? [m.quoted.sender] : [text.replace(/[^0-9]/g, '')+'@s.whatsapp.net']
switch(typeact) {
 case 'promote': 
    Itsuki.groupParticipantsUpdate(m.chat, users, 'promote').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
 break
 case 'demote': 
    Itsuki.groupParticipantsUpdate(m.chat, users, 'demote').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
 break
 case 'add': 
    Itsuki.groupParticipantsUpdate(m.chat, users, 'add').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
 break
 case 'kick': 
    Itsuki.groupParticipantsUpdate(m.chat, users, 'remove').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
 break
 case 'linkgc':
 case 'linkgrup': 
 case 'link':
 case 'linkgroup':
    let x = await Itsuki.groupInviteCode(m.chat) 
    let y = 'https://chat.whatsapp.com/' + x
    Itsuki.newMessage(m.chat, { text: `––––––『 *LINK GROUP* 』––––––\n\nSalin dan share link grup ini untuk menambah member group.`, templateButtons: [{ index: 1, urlButton: { displayText: `Salin tautan`, url: "https://www.whatsapp.com/otp/copy/" + y }
}], footer: config.bot.footer })
 break
 case 'setname':
 case 'setnamegroup':
 case 'setnamegc':
 case 'setsubject':
 if (!text) return m.reply('Masukkan teks.')
 Itsuki.groupUpdateSubject(m.chat, text).then((res) => m.reply('Berhasil mengubah nama grup menjadi ' + `*${text}*`)).catch((err) => m.reply(jsonformat(err)))
 break
}
}
handler.help = ['promote','demote','add','kick','linkgc','setnamegc']
handler.tags = ['group']
handler.command = /^(promote|demote|add|kick|link|linkgc|linkgrup|linkgroup|setname|setnamegroup|setnamegc|setsubject)$/i

handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler

                      