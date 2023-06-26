#!/bin/bash

# WSL 2 specific command
if [ "$USER" = "draker" ]; then
	IP=$(powershell.exe -Command "(Get-NetIPAddress -InterfaceAlias 'Wi-Fi' -AddressFamily IPv4).IPAddress")

# macOS specific command
elif [[ "$OSTYPE" == "darwin"* ]]; then
  IP=$(ipconfig getifaddr en0)

# ubuntu specific command
else
	IP=$(ip addr show wlan0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}')
fi

echo "$IP"
