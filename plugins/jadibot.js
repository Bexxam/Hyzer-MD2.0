// TODO: fix jadibot

import Connection from '../system/connection.js'
import Store from '../system/store.js'
import qrcode from 'qrcode'
import ws from 'ws'

const { DisconnectReason } = await import('baileys')

let handler = async (m, { Itsuki: _Itsuki, args, usedPrefix, command, isOwner }) => {
    /** @type {import('../lib/connection').Socket} */
    let parent = args[0] && args[0] == 'plz' ? _Itsuki : await Connection.Itsuki
    if (!((args[0] && args[0] == 'plz') || (await Connection.Itsuki).user.jid == _Itsuki.user.jid)) {
        throw 'Tidak bisa membuat bot didalam bot!\n\nhttps://wa.me/' + (await Connection.Itsuki).user.jid.split`@`[0] + '?text=.jadibot'
    }

    const id = Connection.Itsukis.size
    const auth = Store.useMemoryAuthState()
    const store = Store.makeInMemoryStore()
    const Itsuki = await Connection.start(null, {
        isChild: true,
        connectionOptions: { auth: auth.state },
        store
    })
    const logout = async () => {
        await parent.sendMessage(Itsuki.user?.jid || m.chat, { text: 'Koneksi terputus...' })
        try { Itsuki.ws.close() } catch { }
        Connection.Itsukis.delete(id)
    }
    let lastQr, shouldSendLogin, errorCount = 0
    Itsuki.ev.on('connection.update', async ({ qr, isNewLogin, lastDisconnect }) => {
        if (shouldSendLogin && Itsuki.user) {
            await parent.sendMessage(Itsuki.user.jid, { text: 'Berhasil tersambung dengan WhatsApp - mu.\n*NOTE: Ini cuma numpang*\n' + JSON.stringify(Itsuki.user, null, 2) }, { quoted: m })
        }
        if (qr) {
            if (lastQr) lastQr.delete()
            lastQr = await parent.sendFile(m.chat, await qrcode.toDataURL(qr, { scale: 8 }), 'qrcode.png', `
Scan QR ini untuk jadi bot sementara
1. Klik titik tiga di pojok kanan atas
2. Ketuk perangkat tertaut
3. Scan QR ini 

QR akan Expired !
`.trim(), m)
        }
        if (isNewLogin)
            shouldSendLogin = true

        if (lastDisconnect) {
            const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
            if (code && code !== DisconnectReason.loggedOut && Itsuki?.ws.readyState !== ws.CONNECTING) {
                console.log(await Connection.reload(Itsuki, true, { isChild: true }).catch(console.error))
            } else if (code == DisconnectReason.loggedOut)
                logout()
            errorCount++;
        }

        if (errorCount > 5)
            logout()

    })

    Connection.Itsukis.set(id, Itsuki)
}


handler.help = ['jadibot']
handler.tags = ['jadibot']

handler.command = /^jadibot$/i

handler.disabled = true
handler.limit = true

export default handler