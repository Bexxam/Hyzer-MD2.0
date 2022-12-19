import { getBuffer } from '../system/function.js'

let handler = async (m, { Itsuki, usedPrefix, args, command }) => {
let buffg = config.thumbnail.random.getRandom()
let buf = await getBuffer(buffg)
var durasi = (args[0] || '').toLowerCase()
switch(durasi) {
case '1hari': {
Itsuki.generateMessage(m.chat, {
text: '🚩 Tunggu beberapa menit creator kami sedang memproses pesanan kamu.\n\n• 1 Hari : [ Rp 1.500,- ]',
contextInfo: {
externalAdReply: {
mediaType: 1,
thumbnail: buf,
thumbnailUrl: buffg,
renderLargerThumbnail: true,
sourceUrl: config.web.group
}
}
}, { quoted: m })
var txtt = `*乂 S E W A  - B O T*

  *Dari :* @${m.sender.split('@')[0]}
  *Selama :* 1 Hari

_Mohon untuk segera memproses pesanan ini._
`
Itsuki.reply(config.owner[0] + '@s.whatsapp.net', txtt, m, { mentions: await Itsuki.parseMention(txtt) })
}
break
case '1minggu': {
Itsuki.generateMessage(m.chat, {
text: '🚩 Tunggu beberapa menit creator kami sedang memproses pesanan kamu.\n\n• 1 Minggu : [ Rp 10.000,- ]',
contextInfo: {
externalAdReply: {
mediaType: 1,
thumbnail: buf,
thumbnailUrl: buffg,
renderLargerThumbnail: true,
sourceUrl: config.web.group
}
}
}, { quoted: m })
var txt = `*乂 S E W A  - B O T*

  *Dari :* @${m.sender.split('@')[0]}
  *Selama :* 1 Minggu

_Mohon untuk segera memproses pesanan ini._
`
Itsuki.reply(config.owner[0] + '@s.whatsapp.net', txt, m, { mentions: await Itsuki.parseMention(txt) })
}
break
case '1bulan': {
Itsuki.generateMessage(m.chat, {
text: '🚩 Tunggu beberapa menit creator kami sedang memproses pesanan kamu.\n\n• 1 Bulan : [ Rp 35.000,- ]',
contextInfo: {
externalAdReply: {
mediaType: 1,
thumbnail: buf,
thumbnailUrl: buffg,
renderLargerThumbnail: true,
sourceUrl: config.web.group
}
}
}, { quoted: m })
var tx = `*乂 S E W A  - B O T*

  *Dari :* @${m.sender.split('@')[0]}
  *Selama :* 1 Bulan 

_Mohon untuk segera memproses pesanan ini._
`
Itsuki.reply(config.owner[0] + '@s.whatsapp.net', txt, m, { mentions: await Itsuki.parseMention(tx) })
}
break
case 'permanen': {
Itsuki.generateMessage(m.chat, {
text: '🚩 Tunggu beberapa menit creator kami sedang memproses pesanan kamu.\n\n• Permanen : [ Rp 50.000,- ]',
contextInfo: {
externalAdReply: {
mediaType: 1,
thumbnail: buf,
thumbnailUrl: buffg,
renderLargerThumbnail: true,
sourceUrl: config.web.group
}
}
}, { quoted: m })
var t = `*乂 S E W A  - B O T*

  *Dari :* @${m.sender.split('@')[0]}
  *Selama :* Permanen

_Mohon untuk segera memproses pesanan ini._
`
Itsuki.reply(config.owner[0] + '@s.whatsapp.net', t, m, { mentions: await Itsuki.parseMention(t) })
}
break
default:  
Itsuki.sendMessage(m.chat, {
text: `🚩 Silahkan pilih daftar harga sewabot di bawah ini.`,
buttonText: "List Harga",
"sections": [
{
"rows": [
{
"title": "1 HARI",
"description": "Rp 1.500,-",
"rowId": ".sewa 1hari"
},
{
"title": "1 MINGGU",
"description": "Rp 10.000,-",
"rowId": ".sewa 1minggu"
},
{
"title": "1 BULAN",
"description": "Rp 35.000,-",
"rowId": ".sewa 1bulan"
},
{
"title": "PERMANEN",
"description": "Rp 50.000,-",
"rowId": ".sewa permanen"
},
]
}
],
}, { 
quoted: m, 
contextInfo: {
stanzaId: m.key.id,
participant: m.sender
}
}
)
}
}
handler.help = ['sewabot', 'belibot']
handler.tags = ['info']
handler.command = /^(sewabot|belibot|sewa)$/i

export default handler 