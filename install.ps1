taskkill /F /IM node.exe /T 2>$null
taskkill /F /IM npm.cmd /T 2>$null
Start-Sleep -Seconds 2

Set-Location "G:\Mój dysk\.AI\PROJEKTY\AKTYWNE\MIESZKANKO LOSZKI\loszki-app"
$output = npm install 2>&1
$output | Out-File "install_log.txt" -Encoding UTF8
Write-Host "Exit: $LASTEXITCODE"
$output | Select-Object -Last 10
