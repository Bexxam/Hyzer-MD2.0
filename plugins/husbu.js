import fetch from "node-fetch";

const handler = async(m, { Itsuki }) => {
await fetch("https://raw.githubusercontent.com/Hyzerr/Database/master/Database/Anime/husbu.json")
 .then(key => key.json())
  .then(res => res.getRandom())
   .then(async(buf) => {
     let buttons = [{ buttonId: '.husbu', buttonText: { displayText: 'Next' }, type: 1 }]
     await Itsuki.newMessage(m.chat, { image: { url: buf }, caption: "Generate random anime husbu.", buttons: buttons, headerType: 5 }, { quoted: m })
   })
}

handler.help = ["husbu"]
handler.tags = ["anime"]
handler.command = /^(husbu)$/i

export default handler 