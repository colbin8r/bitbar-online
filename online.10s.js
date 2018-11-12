#!/usr/bin/env /usr/local/bin/node

// <bitbar.title>Online</bitbar.title>
// <bitbar.version>1.0.0</bitbar.version>
// <bitbar.author>Colby Rogness</bitbar.author>
// <bitbar.author.github>colbin8r</bitbar.author.github>
// <bitbar.desc>Show internet connecivity in your status bar.</bitbar.desc>
// <bitbar.image></bitbar.image>
// <bitbar.dependencies>node</bitbar.dependencies>
// <bitbar.abouturl></bitbar.abouturl>

(async () => {
	const bitbar = require('bitbar')
	const isOnline = require('is-online')
	const internalIpService = require('internal-ip')
	const defaultGatewayService = require('default-gateway')
	const publicIpService = require('public-ip')

	// Timeout when checking connectivity and public IPs, in ms
	const timeout = 3000

	// Choose an icon set based on light (aqua) / dark mode
	const iconsAqua = {
		online: 'iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAJGSURBVFhH7ZY/T1NhFMabNhVwYzF1aWGRRleYSICG6kSII4ShfgBKgiFxMuVTsMFXwEETIxpMmTrJQjQuDBIw8AFc4Nbfee+TVqS35bb3loH+kifvv3Oec265ebmJAQPuAs/zcqiASug1eiOta69Qr9ezCo8eCoyjMvqALih2K4g9R+/RKssx2XUHJkOYvGI8QJ6r0APmAVVUYvlAZTpDcJqkNXTinGIA71+ozDStsq0h6AX64afFD7W+o+cq34SzYQ62UNs/Dcd/GL4yVpA1P8F6FKWkUdvTWUWxlhMI58YW02G14xpKsvnZRfyHH+/toUWWzaRbQt6I5cqj5QOzbbWTSvFhI8PBmYsA5ldoGz1VSM/g9QztoEZjTK1mRiHX4WCOgEv0ExW0HTl4T6MjZA998x36FwLm0ZCWgdD8GHELjHY1bJg0t72Od47VQPNadgcGs8h+8mOKtsViFDuj9OjAdBkdqlZoyP2GlmTXPZjYv4yP8o0CuwaeyD48JL+VUWSYp+zDQ34Kgy++VRP2asguvjmURQ+lLPv2FWAXZ431Ndgzr5TsuwODxv3EuIsmddQRYqfQO+UG3zdhwch+iZdahsZyzUPLewRPbZfjCnIXo+Y5HfcPGilS+ICxJZxVGYoKjxcK5Sl46Sq3QTF5pcULhTZd1TbQUEXh8UM9+3765Je+CWf7DL3dN2Gh6CN06rfQhL3f6LHC+gv13feT34prpvP3TdzQR+N9opn+vTdB0Id7n1D/35sgaCRj0nLAgDskkfgLPbeYBoKlCCAAAAAASUVORK5CYII=',
		offline: 'iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAIuSURBVFhH7ddNS1RhGMbxsTJ06SbCIBWE7AOIEvRG6ErcKIFtjMpUyjBQWoX2GSIRFL+BC6GIpHBRC5cuXIQuWgSFuukD+Pa/mLnlmcfzMufMnLNpLvjBMMx5nsszx/ucKdRTTw3TgLvFl7G5jnt4jGm8KXmNUdxHG1JHZT7gGC/1hpdreIE17OGkQgf4CK3ZgYpzByqjRfxSl/AZ/mZJad3v0Bm8jNhMIqxUM9bhb5LWb0yhEZFZhB2UdSn5iT6cSxPew86QCSqlz81hEDdwFTr+IlpK7/VjFqv4B3dNn/ZYgNY4ywV8RdgBbqmk0dcygC/w/2CjvdWhLPpL/8I+dARboNpSlptYhta2fbSn9g6MZsshttGLZ7CDVeoVapFb0B5aO/AacvMA7r/lBKLOVA80FGegQamvpx1x0R7aK1WiSuli1PVhX4H5hRVUOv0rjqb4MPZhm/ml4kbCFkZQdTrxA0GbJC0lOpOJbiF+3iJoYZOmlNZMHQ27b/AX3UHYNaVS76DP+MdpLa1ZVdz59Am3oYwjrJSlGzZwI+dN0mg+DRVflmUM7pwKKqU8hNbIJU+QxfBMFT05PsImVCjuTGUWjXs9bFkJX66luqD7XVARV66l5hFUwpfbNRU2n8wuVEavcztTV/AHfhn9KmlFVo8ukbHnJyujAnp8tTxF7qXc60m3DD/P4X59mQ9IPQvrhrqBsPuUnakl6HEm8+geFXef0o/RXMrU8z+nUDgFA4s68BA3O7IAAAAASUVORK5CYII='
	}
	const iconsDark = {
		online: 'iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAJGSURBVFhH7ZY/T1NhFMabNhVwYzF1aWGRRleYSICG6kSII4ShfgBKgiFxMuVTsMFXwEETIxpMmTrJQjQuDBIw8AFc4Nbfee+TVqS35bb3loH+kifvv3Oec265ebmJAQPuAs/zcqiASug1eiOta69Qr9ezCo8eCoyjMvqALih2K4g9R+/RKssx2XUHJkOYvGI8QJ6r0APmAVVUYvlAZTpDcJqkNXTinGIA71+ozDStsq0h6AX64afFD7W+o+cq34SzYQ62UNs/Dcd/GL4yVpA1P8F6FKWkUdvTWUWxlhMI58YW02G14xpKsvnZRfyHH+/toUWWzaRbQt6I5cqj5QOzbbWTSvFhI8PBmYsA5ldoGz1VSM/g9QztoEZjTK1mRiHX4WCOgEv0ExW0HTl4T6MjZA998x36FwLm0ZCWgdD8GHELjHY1bJg0t72Od47VQPNadgcGs8h+8mOKtsViFDuj9OjAdBkdqlZoyP2GlmTXPZjYv4yP8o0CuwaeyD48JL+VUWSYp+zDQ34Kgy++VRP2asguvjmURQ+lLPv2FWAXZ431Ndgzr5TsuwODxv3EuIsmddQRYqfQO+UG3zdhwch+iZdahsZyzUPLewRPbZfjCnIXo+Y5HfcPGilS+ICxJZxVGYoKjxcK5Sl46Sq3QTF5pcULhTZd1TbQUEXh8UM9+3765Je+CWf7DL3dN2Gh6CN06rfQhL3f6LHC+gv13feT34prpvP3TdzQR+N9opn+vTdB0Id7n1D/35sgaCRj0nLAgDskkfgLPbeYBoKlCCAAAAAASUVORK5CYII=',
		offline: 'iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAK5SURBVFhH7Zc9axRRFIY3WSNraSOLQjQgqD9AFMEYCUkVbBRBm4jfYhQFxSpofkNQBMV/YCEoIUGxiIVlihQSCwtBiTb+gGTW57337GR258OZzc427gMvc+85555zMsycnVT69OkWjUZjIAiCU7bNhNhhNIYuceYeemS6j6bRabTfwotjzTxFYsbMIdj2odvoDVonPhfE/kZv0QwasXT/huBRFFgSETaFaQf7Bfm2g08bLKNptjstfToE3tKJyOGwKda70JJ83YBc39EdlkNWIhmCnvsj5TclyPcFTViJLfDVcMwjd4eaaA/tTSnuMTqDDhFWRzVURbtlQ5PoIXqN7Q9KhRjxjGXNyriGBjG+dxFt+Pj4g54XUgxxfgotKpHP2gpm1R60Ix4MdRw/XQSw3mwm0BU6bqoJOY6gl2jTFQHWqlm3kFZwjBGwgVbRcXQVucNcxV0L3RbkOYFUQ390/BmKQsA49cPXkv1NlHqn2B9DGooPCNGgnOJ6wNypqAax47YtBgdTm8KkF2JRvijYvqFXKNf0zw25NcXPoV++VLwp1pkjAd8KumDhnUOSg+iT5W0Bu8jdlMCvNy3/T0g7HJ61XIngF0WbmrXw4nC+SoIPPtUW2NZQ4jPFWk3NoTUXHAGbclUttDNIEM4nru/QSdm53kCZcwrbUeQGLtf0eVMUEmk+nbVtCLZrKDqnYk0J7OeVw7blQrHLqOvDsyPoYZgGLqLPaki4llLuVGlQcAItWw8xXEu9aop6hym24Uun43vqXVNPfNlsrKnynylqJc6nJvi+qhNbi/LvFEX2oB+ugwjY1tFeVMqnSybUct9PKipY6/tm0txq+ops5hM9aSp8nig4Z+YQzNfVifl1LXdAUkDf40voI+vE3yl87k6hF8QMmLk8KKL/PDJ/p2hmtCfN9PnPqVT+AgseQ+IvTqb8AAAAAElFTkSuQmCC'
	}
	const icons = bitbar.darkMode ? iconsDark : iconsAqua

	// Returns a "Refresh" BitBar element
	const refresh = () => {
		return {
			text: ':arrows_counterclockwise:  Refresh',
			refresh: true
		}
	}

	const getInternalIp = async () => {
		try {
			const ip = await internalIpService.v4()
			return (ip ? ip : 'No LAN IP')
		} catch (error) {
			return 'No LAN IP'
		}
	}

	const getGatewayIp = async () => {
		try {
			return (await defaultGatewayService.v4()).gateway
		} catch (error) {
			return 'No GW IP'
		}
	}

	const getPublicIp = async () => {
		try {
			return await publicIpService.v4({timeout})
		} catch (error) {
			return 'No public IP'
		}
	}

	const bar = []
	const online = await isOnline({timeout})
	if (online) {
		const internalIp = await getInternalIp()
		const gatewayIp = await getGatewayIp()
		const publicIp = await getPublicIp()

		bar.push({
			text: ' ',
			image: icons.online
		})

		bar.push(bitbar.sep)

		bar.push(`LAN IP: ${internalIp}`)
		bar.push(`LAN GW: ${gatewayIp}`)
		bar.push(`Public IP: ${publicIp}`)
	} else {
		const internalIp = await getInternalIp()
		const gatewayIp = await getGatewayIp()

		bar.push({
			text: ' ',
			image: icons.offline
		})

		bar.push(bitbar.sep)

		bar.push('No Internet connection')
		bar.push(`LAN IP: ${internalIp}`)
		bar.push(`LAN GW: ${gatewayIp}`)
	}

	// Always add a Refresh option to the menu
	bar.push(bitbar.sep)
	bar.push(refresh())

	// Render the menu
	bitbar(bar)
})()
