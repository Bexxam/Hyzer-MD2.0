async function handler(m) {
    if (!m.quoted) return m.reply('Reply pesan!')
    let q = await m.getQuotedObj()
    if (!q.quoted) return m.reply('Pesan yang anda reply tidak mengandung reply!')
    await q.quoted.copyNForward(m.chat, true)
}
handler.command = /^q$/i

export default handler