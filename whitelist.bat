@echo off

REM Prend en compte le premier paramètre
set var1=%1 

netsh advfirewall firewall add rule name="Whitelist de %var1%" dir=in protocol=any action=allow remoteip=%var1%

