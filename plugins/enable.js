import db from '../system/database.js'

// TODO:
// const data = {
//   user: [{
//     name: 'autolevelup',
//     isEnable: true
//   }],
//   chat: [{
//     name: 'welcome',
//     isEnable: true,
//     rules: [{
//     }]
//   }]
// }
let handler = async (m, { Itsuki, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let chat = db.data.chats[m.chat]
  let user = db.data.users[m.sender]
  let bot = db.data.settings[Itsuki.user.jid] || {}
  let type = (args[0] || '').toLowerCase()
  let isAll = false, isUser = false
  switch (type) {
    case 'welcome':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, Itsuki)
          return false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, Itsuki)
        return false
      }
      chat.welcome = isEnable
      break
    case 'detect':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, Itsuki)
          return false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, Itsuki)
        return false
      }
      chat.detect = isEnable
      break
    case 'delete':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, Itsuki)
          return false
        }
      }
      chat.delete = isEnable
      break
    case 'antidelete':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, Itsuki)
          return false
        }
      }
      chat.delete = !isEnable
      break
    // case 'autodelvn':
    //   if (m.isGroup) {
    //     if (!(isAdmin || isOwner)) {
    //       global.dfail('admin', m, Itsuki)
    //       return false
    //     }
    //   }
    //   chat.autodelvn = isEnable
    //   break
    case 'document':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) return dfail('admin', m, Itsuki)
      }
      chat.useDocument = isEnable
      break
    case 'public':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, Itsuki)
        return false
      }
      global.opts['self'] = !isEnable
      break
    case 'antilink':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, Itsuki)
          return false
        }
      }
      chat.antiLink = isEnable
      break
    // case 'toxic':
    //   if (m.isGroup) {
    //     if (!(isAdmin || isOwner)) {
    //       global.dfail('admin', m, Itsuki)
    //       return false
    //     }
    //   }
    //   chat.antiToxic = !isEnable
    //   break
    // case 'antitoxic':
    //   if (m.isGroup) {
    //     if (!(isAdmin || isOwner)) {
    //       global.dfail('admin', m, Itsuki)
    //       return false
    //     }
    //   }
    //   chat.antiToxic = isEnable
    //   break
    case 'autolevelup':
      isUser = true
      user.autolevelup = isEnable
      break
    // case 'mycontact':
    // case 'mycontacts':
    // case 'whitelistcontact':
    // case 'whitelistcontacts':
    // case 'whitelistmycontact':
    // case 'whitelistmycontacts':
    //   if (!isOwner) {
    //     global.dfail('owner', m, Itsuki)
    //     return false
    //   }
    //   Itsuki.callWhitelistMode = isEnable
    //   break
    case 'restrict':
      isAll = true
      if (!isOwner) {
        global.dfail('owner', m, Itsuki)
        return false
      }
      bot.restrict = isEnable
      break
    case 'nyimak':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, Itsuki)
        return false
      }
      global.opts['nyimak'] = isEnable
      break
    case 'autoread':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, Itsuki)
        return false
      }
      global.opts['autoread'] = isEnable
      break
    case 'fakejid':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, Itsuki)
        return false
      }
      bot.fakejid = isEnable
      break
    case 'pconly':
    case 'privateonly':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, Itsuki)
        return false
      }
      global.opts['pconly'] = isEnable
      break
    case 'gconly':
    case 'grouponly':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, Itsuki)
        return false
      }
      global.opts['gconly'] = isEnable
      break
    case 'swonly':
    case 'statusonly':
      isAll = true
      if (!isROwner) {
        global.dfail('rowner', m, Itsuki)
        return false
      }
      global.opts['swonly'] = isEnable
      break
    case 'getmsg':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) return dfail('admin', m, Itsuki)
      }
      chat.getmsg = isEnable
break
default:
if (!/[01]/.test(command)) {
return Itsuki.sendMessage(m.chat, {
text: `Silahkan pilih daftar options yang tersedia di bagian list ini.`,
buttonText: "List Options",
"sections": [
{
"rows": [
{
"title": "Welcome",
"rowId": `.${command}` + " welcome"
},
{
"title": "Detect",
"rowId": `.${command}` + " detect"
},
{
"title": "Delete",
"rowId": `.${command}` + " delete"
},
{
"title": "Antidelete",
"rowId": `.${command}` + " antidelete"
},
{
"title": "Public",
"rowId": `.${command}` + " public"
},
{
"title": "Antilink",
"rowId": `.${command}` + " antilink"
},
{
"title": "Autolevelup",
"rowId": `.${command}` + " autolevelup"
},
{
"title": "Document",
"rowId": `.${command}` + " document"
},
{
"title": "Whitelist contact",
"rowId": `.${command}` + " whitelistmycontact"
},
{
"title": "Restrict",
"rowId": `.${command}` + " restrict"
},
{
"title": "Nyimak",
"rowId": `.${command}` + " nyimak"
},
{
"title": "Autoread",
"rowId": `.${command}` + " autoread"
},
{
"title": "FakeJid",
"rowId": `.${command}` + " fakejid"
},
{
"title": "Private Only",
"rowId": `.${command}` + " pconly"
},
{
"title": "Group Only",
"rowId": `.${command}` + " gconly"
},
{
"title": "Status Whatsapp Only",
"rowId": `.${command}` + " swonly"
},
{
"title": "Getmsg",
"rowId": `.${command}` + " getmsg"
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
return false
}
m.reply(`Berhasil me${isEnable ? 'nyala' : 'mati'}kan *${type}* ${isAll ? 'untuk bot ini' : isUser ? '' : 'untuk chat ini'}`.trim())
}
handler.help = ['en', 'dis'].map(v => v + 'able')
handler.tags = ['group', 'owner']
handler.command = /^((en|dis)able|(tru|fals)e|(turn)?o(n|ff)|[01])$/i

export default handler
