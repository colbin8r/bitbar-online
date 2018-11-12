# bitbar-online

<p align="center">
A plugin for <a href="https://getbitbar.com/">BitBar</a> to display the true status of your internet connection, your LAN IP and gateway, and your public IP.
</p>

<p align="center">
	<a href="https://github.com/colbin8r/bitbar-online/releases"><img src="https://img.shields.io/github/tag/colbin8r/bitbar-online.svg" alt="GitHub tag (latest SemVer)" /></a>
	<a href="https://github.com/colbin8r/bitbar-online/issues"><img src="https://img.shields.io/github/issues/colbin8r/bitbar-online.svg" alt="GitHub issues" /></a>
	<img src="https://img.shields.io/node/v/bitbar-online.svg" alt="node version" />
	<a href="http://commitizen.github.io/cz-cli/"><img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen friendly" /></a>
</p>

---

## Features

- [X] True Internet connectivity status on your Mac status bar
- [X] Different icons display connectivity status at a glance
- [X] Takes minimal space on the status bar
- [X] Shows LAN IP and gateway IP
- [X] Queries and displays your public IP address
- [X] Refreshes every 10 seconds

## Installation

Requires Node. So far, only tested with version 11.1.

Go to your BitBar plugin directory:
```sh
$ cd "$(defaults read com.matryer.BitBar pluginsDirectory)"
```

Clone the plugin into your BitBar plugin directory:
```sh
$ git clone https://github.com/colbin8r/bitbar-online
```

Install dependencies:
```sh
$ cd bitbar-online
$ npm i
```

Activate the plugin with a symlink:
```
$ cd ..
$ ln -s bitbar-online/online.10s.js
```

Refresh your BitBar to verify everything works!

### Changing the update interval

By default, the plugin refreshes every 10 seconds. You can always open the dropdown and manually refresh it if you like.

The [update interval is encoded in the name](https://github.com/matryer/bitbar#configure-the-refresh-time) of the file in the BitBar plugins directory. To change it, just change the name of the symlink:

```sh
$ cd "$(defaults read com.matryer.BitBar pluginsDirectory)"
$ mv online.10s.js online.1m.js # Change to 1 minute
```

### Uninstalling

Remove the symlink and plugin folder:
```
$ cd "$(defaults read com.matryer.BitBar pluginsDirectory)"
$ rm online.10s.js
$ rm -rf bitbar-online
```
