import uco from 'baileys'
const {
    makeWASocket,
    makeWALegacySocket,
    MessageType,
    Mimetype,
    makeInMemoryStore,
    prepareWAMessageMedia,
    getBinaryNodeChild,
    WA_DEFAULT_EPHEMERAL,
    WAMessageStubType,
    proto,
    downloadContentFromMessage,
    jidDecode,
    areJidsSameUser,
    generateForwardMessageContent,
    generateWAMessage,
    generateWAMessageFromContent,
    extractMessageContent,
    getContentType,
    toReadable
} = uco

async function generateMess(Itsuki, jid, message, quoted = {}, options = {}){
       let typeMes = message.image || message.text || message.video || message.contacts || message.document ? "composing" : "recording";
       if (!message.react) await Itsuki.sendPresenceUpdate(typeMes, jid)
       let generate = await generateWAMessage(jid, message, quoted)
       const type = getContentType(generate.message)
       if ('contextInfo' in message) generate.message[type].contextInfo = {
          ...generate.message[type].contextInfo,
          ...message.contextInfo
       }
       if ('contextInfo' in options) generate.message[type].contextInfo = {
           ...generate.message[type].contextInfo,
           ...options.contextInfo
       }
       return await Itsuki.relayMessage(jid, generate.message, {
         messageId: generate.key.id
   }).then(() => generate)
}

async function prepareMess(Itsuki, jid, content, quoted) {
            let typeall = content.image || content.text || content.video || content.location || content.react || content.sticker || content.contacts ? 'composing' : 'recording'
    if (!content.react) await Itsuki.sendPresenceUpdate(typeall, jid)
    return Itsuki.sendMessage(jid, content, quoted)
}

export {
  generateMess,
  prepareMess
}