import fetch from "node-fetch";
import { 
  youtubedl, 
  youtubedlv2, 
  youtubedlv3 
} from "@bochilteam/scraper";
import { getBuffer } from "../system/function.js";
import db from "../system/database.js";

let limit = 500
let handler = async (m, { Itsuki, args, isPrems, isOwner }) => {
if (!args || !args[0]) return m.reply("Gunakan format command beserta link youtube yang akan diunduh.")
let chat = db.data.chats[m.chat]
let isY = /y(es)/gi.test(args[1])
let { thumbnail, video: _video, title } = await youtubedl(args[0]).catch(async _ => await youtubedlv2(args[0])).catch(async _ => await youtubedlv3(args[0]))
const limitedSize = (isPrems || isOwner ? 2000 : limit) * 1024
let video, source, res, link, lastError, isLimit
for (let i in _video) {
try {
      video = _video[i]
      if (isNaN(video.fileSize)) continue
      isLimit = limitedSize < video.fileSize
      if (isLimit) continue
      link = await video.download()
      if (link) res = await fetch(link)
      isLimit = res?.headers.get("content-length") && parseInt(res.headers.get("content-length")) < limitedSize
      if (isLimit) continue
      if (res) source = await res.arrayBuffer()
      if (source instanceof ArrayBuffer) break
    } catch (e) {
      video = source = link = null
      lastError = e
    }
  }
  if ((!(source instanceof ArrayBuffer) || !link || !res.ok) && !isLimit) return m.reply('Error : ' + (lastError || 'Can\'t download video'))
  if (!isY && !isLimit) {
  let tum = await getBuffer(thumbnail)
  Itsuki.newMessage(m.chat, {
    text: `*乂 Y O U T U B E - V I D E O*

  *◦ Title :* ${title}
  *◦ Filesize :* ${video.fileSizeH}
  *◦ ${isLimit ? 'Pakai ' : ''}Link :* ${link}`,
    contextInfo: {
     externalAdReply: {
     title: title,
     thumbnail: tum,
     mediaType: 1,
     renderLargerThumbnail: true,
     thumbnailUrl: thumbnail,
     sourceUrl: '-'
   }}}, { quoted: m })
  }
  let _thumb = {}
  try { _thumb = { thumbnail: await (await fetch(thumbnail)).buffer() } }
  catch (e) { }
  if (!isLimit) await Itsuki.newMessage(m.chat, { video: { url: link }}, { quoted: m })
}
handler.help = ['mp4', 'v', ''].map(v => 'yt' + v)
handler.tags = ['downloader']
handler.command = /^yt(v|mp4)?$/i

handler.wait = true

export default handler

