import fetch from 'node-fetch'

let handler = async (m, { Itsuki, text, usedPrefix, command }) => {
if (!text) return m.reply('🚩 Sertakan link yang akan di unduh!')
let res = await fetch('https://api.lolhuman.xyz/api/instagram?apikey=SadTeams&url=' + text)
let data = await res.json()
let obf = data.result
for (let i = 0; i < obf.length; i++) {
Itsuki.sendFile(m.chat, obf[i], obf[i], null, m)
}
}
handler.help = ['instagram','igstory','igdl']
handler.tags = ['downloader']
handler.command = /^(instagram|instagramstory|ig|igs)$/i

export default handler