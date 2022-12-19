let handler = async (m, { Itsuki, text, participants, isAdmin, isOwner }) => {
    let users = participants.map(u => u.id).filter(v => v !== Itsuki.user.jid)
    m.reply(`${text ? `${text}\n` : ''}┌─「 Tag All 」\n` + users.map(v => '│◦ @' + v.replace(/@.+/, '')).join`\n` + '\n└────', null, {
        mentions: users
    })
}

handler.help = ['tagall']
handler.tags = ['group']
handler.command = ['tagall']
handler.admin = true
handler.group = true

export default handler
