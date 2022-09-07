import { Extension, HPacket, HDirection } from 'gnode-api'
import hypertranslate from './hypertranslate.js'

const extensionInfo = {
	name: "G-Hypertranslate",
	description: "Play translation telephone using Google Translate",
	version: "1.0.0",
	author: "Alynva",
}

const ext = new Extension(extensionInfo)

const config = {
	source: 'auto',
	target: 'auto',
	count: 10,
}

ext.on('init', () => {
	ext.writeToConsole("Open the original version at https://www.ravbug.com/hypertranslate/", "yellow")
	ext.writeToConsole("Waiting client connection...")
})

ext.on('connect', host => {
	ext.writeToConsole("Client connection established.")
	ext.writeToConsole(`Host detected: ${host}`)
	ext.writeToConsole(`Current configuration:
${Object.entries(config).map(v => `- ${v[0]}: ${v[1]}`).join('\n')}`)
	ext.writeToConsole("More configuration is planned to be implemented..")
})

ext.interceptByNameOrHash(HDirection.TOSERVER, 'Chat', async hMessage => {
	hMessage.blocked = true

	const packet = hMessage.getPacket()
	const message = packet.readString(packet.readIndex, "utf8")

	const translated = await hypertranslate(message, config.source, config.target, config.count)
		.catch(err => {
			ext.writeToConsole(`Error while translating.`, "red")
			ext.writeToConsole(JSON.stringify({ message, errorMessage: err.message, ...config }, null, 2), "red")
			return message
		})

	const newPacket = new HPacket(`{out:Chat}{s:"${translated}"}{i:${packet.readInteger()}}{i:${packet.readInteger()}}`)

	ext.sendToServer(newPacket)
})

ext.run()
