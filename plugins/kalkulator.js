const handler = async (m, { Itsuki, text }) => {
  var id = m.chat
  Itsuki.math = Itsuki.math ? Itsuki.math : {}
  if (id in Itsuki.math) {
    clearTimeout(Itsuki.math[id][3])
    delete Itsuki.math[id]
    m.reply('🚩 Terdeteksi kamu menggunakan kalkulator saat dalam sesi bermain math.')
  }
  var val = text
    .replace(/[^0-9\-\/+*×÷πEe()piPI/]/g, '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π|pi/gi, 'Math.PI')
    .replace(/e/gi, 'Math.E')
    .replace(/\/+/g, '/')
    .replace(/\++/g, '+')
    .replace(/-+/g, '-')
  var format = val
    .replace(/Math\.PI/g, 'π')
    .replace(/Math\.E/g, 'e')
    .replace(/\//g, '÷')
    .replace(/\*×/g, '×')
  try {
    console.log(val)
    var result = (new Function('return ' + val))()
    if (!result) throw result
    m.reply(`*${format} = ${result}*`)
  } catch (e) {
    if (e == undefined) return m.reply('Isinya?')
    return m.reply('🚩 Format salah, hanya 0-9 dan Simbol -, +, *, /, ×, ÷, π, e, (, ) yang disupport')
  }
}
handler.help = ['kalkulator <soal>']
handler.tags = ['tools']
handler.command = /^(calc(ulat(e|or))?|kalk(ulator)?)$/i

export default handler 
