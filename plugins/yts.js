import { youtubeSearch } from '@bochilteam/scraper'
let handler = async (m, { Itsuki, usedPrefix, text }) => {
  if (!text) return m.reply('Cari apa?')
  const { video, channel } = await youtubeSearch(text)
  const listSections = []
  let teks = [...video, ...channel].map(v => {
    switch (v.type) {
      case 'video': {
        listSections.push([`${v.title}`, [
          ['Video π₯', `${usedPrefix}ytv ${v.url} yes`, `download ${v.title} (${v.url})`],
          ['Audio π§', `${usedPrefix}yta ${v.url} yes`, `download ${v.title} (${v.url})`]
        ]])
        return `
π *${v.title}* (${v.url})
β Duration: ${v.durationH}
β²οΈ Uploaded ${v.publishedTime}
ποΈ ${v.view} views
      `.trim()
      }
      case 'channel': return `
π *${v.channelName}* (${v.url})
π§βπ€βπ§ _${v.subscriberH} (${v.subscriber}) Subscriber_
π₯ ${v.videoCount} video
`.trim()
    }
  }).filter(v => v).join('\n\n========================\n\n')
  Itsuki.sendList(m.chat, 'πΊYoutube Searchπ', '\nDownload List', config.bot.footer, 'Choose', listSections, m)
}
handler.help = ['', 'earch'].map(v => 'yts' + v + ' <pencarian>')
handler.tags = ['internet']
handler.command = /^yts(earch)?$/i

handler.wait = true

export default handler
