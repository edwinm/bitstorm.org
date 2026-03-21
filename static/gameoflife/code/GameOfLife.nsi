; NSI-file for GameOfLife

SetCompressor lzma
Name "GameOfLife 1.5"
OutFile "..\dist\GameOfLife-1.5-installer.exe"
Caption "Game of Life installer"
ShowInstDetails nevershow
InstallDir "$PROGRAMFILES\GameOfLife"
DirText "This will install the freeware program John Conway's Game of Life 1.5."
UninstallText "This will uninstall the Game of Life from your system"
ShowUninstDetails nevershow
AutoCloseWindow true
XPStyle on

Section "" ; (default section)
	SetOutPath "$INSTDIR"
	File GameOfLife.jar
	File cells.ico
	File gol.ico
	File jarx.exe
	File default.jarx
	File glider.cells
	File manual.mht

	; Associate .cells
	WriteRegStr HKCR ".cells" "" "GameOfLife"
	WriteRegStr HKCR "GameOfLife" "" "Game of Life cells file"
	WriteRegStr HKCR "GameOfLife\DefaultIcon" "" "$INSTDIR\cells.ico"
	WriteRegStr HKCR "GameOfLife\shell\open\command" "" "$INSTDIR\jarx.exe %1"
	WriteRegStr HKCR "MIME\Database\Content Type\application/x-cells" "Extension" ".cells"

	; Uninstall info
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\GameOfLife" "DisplayName" "Game of Life"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\GameOfLife" "DisplayIcon" "$INSTDIR\gol.ico"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\GameOfLife" "DisplayVersion" "1.5"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\GameOfLife" "UninstallString" '"$INSTDIR\Uninstall.exe"'
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\GameOfLife" "URLInfoAbout" "http://www.bitstorm.org/gameoflife/"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\GameOfLife" "Publisher" "Edwin Martin"
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\GameOfLife" "NoModify" 1
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\GameOfLife" "NoRepair" 1

	; Start menu
	CreateDirectory "$SMPROGRAMS\GameOfLife"
	CreateShortCut "$SMPROGRAMS\GameOfLife\Game of Life.lnk" "$INSTDIR\jarx.exe" "" "$INSTDIR\gol.ico" "" "" "" "Start the Game of Life"
	CreateShortCut "$SMPROGRAMS\GameOfLife\Game of Life website.lnk" "http://www.bitstorm.org/gameoflife/standalone/" "" "" "" "" "" "On line Game of Life website"
	CreateShortCut "$SMPROGRAMS\GameOfLife\Manual.lnk" "$INSTDIR\manual.mht" "" "" "" "" "" "Game of Life Manual"
	CreateShortCut "$SMPROGRAMS\GameOfLife\Online lexicon.lnk" "http://www.bitstorm.org/gameoflife/lexicon/" "" "" "" "" "" "Life Lexicon (compilation of shapes by Stephen A. Silver)"
	CreateShortCut "$SMPROGRAMS\GameOfLife\Uninstall Game of Life.lnk" "$INSTDIR\Uninstall.exe" "" "" "" "" "" "Remove the Game of Life from your computer"

	WriteUninstaller "Uninstall.exe"
	Delete "$INSTDIR\GameOfLife.exe"
	Call RefreshShellIcons
SectionEnd ; end of default section

Section Uninstall
	; Delete form Program Files
	Delete "$INSTDIR\Uninstall.exe"
	Delete "$INSTDIR\GameOfLife.jar"
	Delete "$INSTDIR\cells.ico"
	Delete "$INSTDIR\gol.ico"
	Delete "$INSTDIR\jarx.exe"
	Delete "$INSTDIR\default.jarx"
	Delete "$INSTDIR\glider.cells"
	Delete "$INSTDIR\manual.mht"
	RMDir "$INSTDIR"

	; Delete from Start menu
	Delete "$SMPROGRAMS\GameOfLife\*.*"
	RMDir "$SMPROGRAMS\GameOfLife"

	; Delete uninstall info
	DeleteRegKey HKEY_LOCAL_MACHINE "SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\GameOfLife"

	; Delete file associations
	DeleteRegKey HKCR ".cells"
	DeleteRegKey HKCR "GameOfLife"
	DeleteRegKey HKCR "MIME\Database\Content Type\application/x-cells"
SectionEnd ; end of uninstall section

Function .onInstSuccess
	MessageBox MB_YESNO "Game of Life is successfully installed. Start Game of Life?" IDNO NoExe
	ExecShell open $INSTDIR/glider.cells
	NoExe:
FunctionEnd

!define SHCNE_ASSOCCHANGED 0x08000000
!define SHCNF_IDLIST 0

Function RefreshShellIcons
  ; By jerome tremblay - april 2003
  System::Call 'shell32.dll::SHChangeNotify(i, i, i, i) v \
  (${SHCNE_ASSOCCHANGED}, ${SHCNF_IDLIST}, 0, 0)'
FunctionEnd


; eof
