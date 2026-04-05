Set oShell = CreateObject("WScript.Shell")
oShell.Run "cmd /c """ & Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\")) & "start_loszki.bat""", 0, False
