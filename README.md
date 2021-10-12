# iobroker-unifi-presence

Zur Verwendung mit dem UniFi Adapter https://github.com/iobroker-community-adapters/ioBroker.unifi
Das Script prüft, ob ein angegebenes Gerät mit dem WLAN verbunden ist. Sollte sich das Gerät nicht im WLAN befinden, wird dieses nach x Minuten als abwesend markiert.

pfad: Gibt an, wo die Datenpunkte erstellt werden.
json: Enthält die abzufragenen Daten und Einstellungen. (Name: Name der Person, MAC: Mac-Adresse des abzufragenden Gerätes, Zeit: Abwesend nach x Minuten)
telegram: Schickt eine Nachricht via Telegram wenn eine Person ankommt / geht
