import { spawn } from 'child_process'
import { format } from 'util'

let handler = async (m, { Itsuki, usedPrefix, command }) => {
    if (!global.support.convert &&
        !global.support.magick &&
        !global.support.gm) return handler.disabled = true // Disable if doesnt support
    if (!m.quoted) return m.reply('• Balas sticker dengan command ' + usedPrefix+ command)
    let q = m.quoted
    if (/sticker/.test(q.mediaType)) {
        let sticker = await q.download()
        if (!sticker) throw sticker
        let bufs = []
        const [_spawnprocess, ..._spawnargs] = [...(global.support.gm ? ['gm'] : global.support.magick ? ['magick'] : []), 'convert', 'webp:-', 'png:-']
        let im = spawn(_spawnprocess, _spawnargs)
        im.on('error', e => m.reply(format(e)))
        im.stdout.on('data', chunk => bufs.push(chunk))
        im.stdin.write(sticker)
        im.stdin.end()
        im.on('exit', () => {
            Itsuki.sendFile(m.chat, Buffer.concat(bufs), 'image.png', config.bot.about, m)
        })
    } else return m.reply('• Balas sticker dengan command ' + usedPrefix+ command)
}
handler.help = ['toimg']
handler.tags = ['sticker']
handler.command = /^toimg$/i

handler.wait = true

export default handler