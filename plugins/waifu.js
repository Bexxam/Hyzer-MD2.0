import fetch from 'node-fetch'

let handler = async (m, { Itsuki, usedPrefix }) => {
    let res = await fetch('https://api.waifu.pics/sfw/waifu')
    if (!res.ok) return m.reply(await res.text())
    let json = await res.json()
    if (!json.url) return m.reply('Error!')
    Itsuki.sendButton(m.chat, 'Istri kartun', config.bot.about, json.url, [['waifu', `${usedPrefix}waifu`]], m)
}
handler.help = ['waifu']
handler.tags = ['anime']
handler.command = /^(waifu)$/i
//MADE IN ERPAN 1140 BERKOLABORASI DENGAN BTS
export default handler