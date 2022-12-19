import { youtubeSearch } from '@bochilteam/scraper'
let handler = async (m, { Itsuki, command, text, usedPrefix }) => {
  if (!text) throw `Use example ${usedPrefix}${command} Minecraft`
  let vid = (await youtubeSearch(text)).video[0]
  if (!vid) throw 'Video/Audio Tidak ditemukan'
  let { title, description, thumbnail, videoId, durationH, viewH, publishedTime } = vid
  const url = 'https://www.youtube.com/watch?v=' + videoId
   Itsuki.newMessage(m.chat, {
             image: { url: thumbnail + '.png' },
             caption: `
📌 *Title:* ${title}
🔗 *Url:* ${url}
🗯️ *Description:* ${description}
⏲️ *Published:* ${publishedTime}
⌚ *Duration:* ${durationH}
👁️ *Views:* ${viewH}
  `.trim(),
             templateButtons: [
             {
             index: 1,
             urlButton: {
             displayText: `📺 Go To Youtube!'`,
             url: url
            }            
            },
            { quickReplyButton: { displayText: 'Audio 🎶', id: `.yta ${url}` }},
            { quickReplyButton: { displayText: 'Video 📽️', id: `.ytv ${url}` }}
            ],
          footer: config.bot.footer
        })
}
handler.help = ['play', 'play2'].map(v => v + ' <pencarian>')
handler.tags = ['downloader']
handler.command = /^play2?$/i

handler.exp = 0
handler.limit = false

export default handler

