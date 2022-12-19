// @ts-check
import * as ws from 'ws'
import path from 'path'
import storeSystem from './store.js'
import Helper from './helper.js'
import { HelperConnection } from './realize.js'
import importFile from './import.js'
import db, { loadDatabase } from './database.js'
import single2multi from './single2multi.js'
import P from 'pino'

/** @type {import('@adiwajshing/baileys')} */
// @ts-ignore
const {
    DisconnectReason,
    default: makeWASocket,
    // useSingleFileAuthState
} = (await import('baileys')).default

const authFolder = storeSystem.fixFileName(`${Helper.opts._[0] || ''}sessions`)
const authFile = `${Helper.opts._[0] || 'session'}.data.json`

let [
    isCredsExist,
    isAuthSingleFileExist,
    authState
] = await Promise.all([
    Helper.checkFileExists(authFolder + '/creds.json'),
    Helper.checkFileExists(authFile),
    storeSystem.useMultiFileAuthState(authFolder)
])

const store = storeSystem.makeInMemoryStore()

// Convert single auth to multi auth
if (Helper.opts['singleauth'] || Helper.opts['singleauthstate']) {
    if (!isCredsExist && isAuthSingleFileExist) {
        console.debug('- singleauth -', 'creds.json not found', 'compiling singleauth to multiauth...')
        await single2multi(authFile, authFolder, authState)
        console.debug('- singleauth -', 'compiled successfully')
        authState = await storeSystem.useMultiFileAuthState(authFolder)
    } else if (!isAuthSingleFileExist) console.error('- singleauth -', 'singleauth file not found')
}

const storeFile = './system/storage/store.json'
store.readFromFile(storeFile)

// from: https://github.com/adiwajshing/Baileys/blob/master/src/Utils/logger.ts
const logger = P({
    timestamp: () => `,"time":"${new Date().toJSON()}"`
}).child({ class: 'baileys' })

/** @type {import('@adiwajshing/baileys').UserFacingSocketConfig} */
const connectionOptions = {
    printQRInTerminal: true,
    patchMessageBeforeSending: (message) => {
                const requiresPatch = !!(
                    message.buttonsMessage 
                    || message.templateMessage
                    || message.listMessage
                );
                if (requiresPatch) {
                    message = {
                        viewOnceMessage: {
                            message: {
                                messageContextInfo: {
                                    deviceListMetadataVersion: 2,
                                    deviceListMetadata: {},
                                },
                                ...message,
                            },
                        },
                    };
                }

                return message;
            },
    auth: authState.state,
    logger
}

/** 
 * @typedef {{ 
 *  handler?: typeof import('../handler').handler; 
 *  participantsUpdate?: typeof import('../handler').participantsUpdate; 
 *  groupsUpdate?: typeof import('../handler').groupsUpdate; 
 *  onDelete?:typeof import('../handler').deleteUpdate; 
 *  connectionUpdate?: typeof connectionUpdate; 
 *  credsUpdate?: () => void 
 * }} EventHandlers
 * @typedef {Required<import('@adiwajshing/baileys').UserFacingSocketConfig>['logger']} Logger
 * @typedef {ReturnType<typeof makeWASocket> & EventHandlers & { 
 *  isInit?: boolean; 
 *  isReloadInit?: boolean; 
 *  msgqueque?: import('./queque').default;
 *  logger?: Logger
 * }} Socket 
 */


/** @type {Map<string, Socket>} */
let Itsukis = new Map();
/** 
 * @param {Socket?} oldSocket 
 * @param {{ 
 *  handler?: typeof import('../handler'); 
 *  isChild?: boolean; 
 *  connectionOptions?: Partial<import('@adiwajshing/baileys').UserFacingSocketConfig>; 
 *  store: typeof store 
 * }} opts
 */
async function start(oldSocket = null, opts = { store }) {
    /** @type {Socket} */
    let Itsuki = makeWASocket({
        ...connectionOptions,
        ...opts.connectionOptions,
        getMessage: async (key) => (
            opts.store.loadMessage(/** @type {string} */(key.remoteJid), key.id) ||
            opts.store.loadMessage(/** @type {string} */(key.id)) || {}
        ).message || { conversation: 'Please send messages again' },
    })
    HelperConnection(Itsuki, { store: opts.store, logger })

    if (oldSocket) {
        Itsuki.isInit = oldSocket.isInit
        Itsuki.isReloadInit = oldSocket.isReloadInit
    }
    if (Itsuki.isInit == null) {
        Itsuki.isInit = false
        Itsuki.isReloadInit = true
    }

    store.bind(Itsuki.ev, {
        groupMetadata: Itsuki.groupMetadata
    })
    await reload(Itsuki, false, opts).then((success) => console.log('- bind handler event -', success))

    return Itsuki
}


let OldHandler = null
/** 
 * @param {Socket} Itsuki 
 * @param {boolean} restartConnection
 * @param {{ 
 *  handler?: Promise<typeof import('../handler')> | typeof import('../handler'); 
 *  isChild?: boolean 
 * }} opts
 */
async function reload(Itsuki, restartConnection, opts = {}) {
    if (!opts.handler) opts.handler = importFile(Helper.__filename(path.resolve('./handler.js'))).catch(console.error)
    if (opts.handler instanceof Promise) opts.handler = await opts.handler;
    if (!opts.handler && OldHandler) opts.handler = OldHandler
    OldHandler = opts.handler
    // const isInit = !!Itsuki.isInit
    const isReloadInit = !!Itsuki.isReloadInit
    if (restartConnection) {
        try { Itsuki.ws.close() } catch { }
        // @ts-ignore
        Itsuki.ev.removeAllListeners()
        Object.assign(Itsuki, await start(Itsuki) || {})
    }

    // Assign message like welcome, bye, etc.. to the connection
    Object.assign(Itsuki, getMessageConfig())

    if (!isReloadInit) {
        if (Itsuki.handler) Itsuki.ev.off('messages.upsert', Itsuki.handler)
        if (Itsuki.participantsUpdate) Itsuki.ev.off('group-participants.update', Itsuki.participantsUpdate)
        if (Itsuki.groupsUpdate) Itsuki.ev.off('groups.update', Itsuki.groupsUpdate)
        if (Itsuki.onDelete) Itsuki.ev.off('messages.delete', Itsuki.onDelete)
        if (Itsuki.connectionUpdate) Itsuki.ev.off('connection.update', Itsuki.connectionUpdate)
        if (Itsuki.credsUpdate) Itsuki.ev.off('creds.update', Itsuki.credsUpdate)
    }
    if (opts.handler) {
        Itsuki.handler = /** @type {typeof import('../handler')} */(opts.handler).handler.bind(Itsuki)
        Itsuki.participantsUpdate = /** @type {typeof import('../handler')} */(opts.handler).participantsUpdate.bind(Itsuki)
        Itsuki.groupsUpdate = /** @type {typeof import('../handler')} */(opts.handler).groupsUpdate.bind(Itsuki)
        Itsuki.onDelete = /** @type {typeof import('../handler')} */(opts.handler).deleteUpdate.bind(Itsuki)
    }
    if (!opts.isChild) Itsuki.connectionUpdate = connectionUpdate.bind(Itsuki)
    Itsuki.credsUpdate = authState.saveCreds.bind(Itsuki)
    // Itsuki.credsUpdate = authState.saveState.bind(Itsuki)

    /** @typedef {Required<EventHandlers>} Event */
    Itsuki.ev.on('messages.upsert', /** @type {Event} */(Itsuki).handler)
    Itsuki.ev.on('group-participants.update', /** @type {Event} */(Itsuki).participantsUpdate)
    Itsuki.ev.on('groups.update', /** @type {Event} */(Itsuki).groupsUpdate)
    Itsuki.ev.on('messages.delete', /** @type {Event} */(Itsuki).onDelete)
    if (!opts.isChild) Itsuki.ev.on('connection.update', /** @type {Event} */(Itsuki).connectionUpdate)
    Itsuki.ev.on('creds.update', /** @type {Event} */(Itsuki).credsUpdate)

    Itsuki.isReloadInit = false
    return true

}

/**
 * @this {Socket}
 * @param {import('@adiwajshing/baileys').BaileysEventMap<unknown>['connection.update']} update
 */
async function connectionUpdate(update) {
    console.log(update)
    const { connection, lastDisconnect, isNewLogin } = update
    if (isNewLogin) this.isInit = true
    // @ts-ignore
    const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
    if (code && code !== DisconnectReason.loggedOut && this?.ws.readyState !== ws.CONNECTING) {
        console.log(await reload(this, true).catch(console.error))
        global.timestamp.connect = new Date
    }
    if (connection == 'open') console.log('- opened connection -')

    if (db.data == null) loadDatabase()
}

function getMessageConfig() {
    const welcome = 'Hai, @user!\nSelamat datang di grup @subject\n\n@desc'
    const bye = 'Selamat tinggal @user!'
    const spromote = '@user sekarang admin!'
    const sdemote = '@user sekarang bukan admin!'
    const sDesc = 'Deskripsi telah diubah ke \n@desc'
    const sSubject = 'Judul grup telah diubah ke \n@subject'
    const sIcon = 'Icon grup telah diubah!'
    const sRevoke = 'Link group telah diubah ke \n@revoke'

    return {
        welcome,
        bye,
        spromote,
        sdemote,
        sDesc,
        sSubject,
        sIcon,
        sRevoke
    }
}

const Itsuki = start(null, { store }).catch(console.error)


export default {
    start,
    reload,

    Itsuki,
    Itsukis,
    logger,
    connectionOptions,

    authFolder,
    storeFile,
    authState,
    store,

    getMessageConfig
}
export {
    Itsuki,
    Itsukis,
    logger
}
