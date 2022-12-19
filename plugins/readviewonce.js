let { downloadContentFromMessage } = (await import('baileys'));

let handler = async (m, { Itsuki }) => {
    if (!m.quoted) return m.reply('Where\'s message?')
    if (m.quoted.mtype !== 'viewOnceMessage') return m.reply('Itu bukan pesan viewOnce')
    const buffer = await m.quoted.download()
    const media = m.quoted.mediaMessage[m.quoted.mediaType]
    Itsuki.sendFile(m.chat, buffer, /video/.test(media.mimetype) ? 'video.mp4' : 'image.jpg', media.caption || '', m)
}

handler.help = ['readviewonce','rvo']
handler.tags = ['tools']
handler.command = /^(readviewonce|rvo)$/i

export default handler
