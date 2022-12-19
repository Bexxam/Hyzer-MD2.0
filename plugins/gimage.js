import { googleImage } from '@bochilteam/scraper'
let handler = async (m, { Itsuki, text, usedPrefix, command }) => {
    if (!text) throw `Use example ${usedPrefix}${command} Minecraft`
    const res = await googleImage(text)
    const capt = `*── 「 GOOGLE IMAGE 」 ──*

Result from *${text}*
`.trim()
    Itsuki.sendButton(m.chat, capt, config.bot.footer, res.getRandom(), [['Next Image','.gimage ' + text]], m)
}
handler.help = ['gimage', 'image']
handler.tags = ['internet']
handler.command = /^(gimage|image)$/i

export default handler