const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const qrcode = require("qrcode-terminal")
const ALERTA = "5511979755200@s.whatsapp.net"

async function start() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')
    const sock = makeWASocket({ auth: state, printQRInTerminal: true })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0]
        if (!m.message) return
        const texto = m.message.conversation || m.message.extendedTextMessage?.text || "audio/foto"
        const low = texto.toLowerCase()
        const ehGuincho = low.includes("guincho") || low.includes("pane") || low.includes("socorro") || low.includes("cotia") || m.message.audioMessage || m.message.locationMessage
        if (!ehGuincho) return
        await sock.sendMessage(ALERTA, { text: `🚨 GUINCHO: ${texto}\nGrupo: ${m.key.remoteJid}` })
    })
}
start()
