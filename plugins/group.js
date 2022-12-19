var handler = async (m, {
	Itsuki,
	args,
	usedPrefix,
	command
}) => {
	var isClose = { 
		'open': 'not_announcement',
		'close': 'announcement',
	} [(args[0] || '')]
	if (isClose === undefined)
		return m.reply(`
*Format salah! Contoh :*
  *○ ${usedPrefix + command} close*
  *○ ${usedPrefix + command} open*
`.trim())
	await Itsuki.groupSettingUpdate(m.chat, isClose)
}
handler.help = ['group']
handler.tags = ['group']
handler.command = /^(group)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler 