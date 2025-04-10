; Inno Setup script
[Setup]
AppName=MyProject
AppVersion=1.0
DefaultDirName={pf}\MyProject
DisableProgramGroupPage=yes
OutputDir=.\Output
OutputBaseFilename=MyProjectInstaller
Compression=lzma
SolidCompression=yes
UninstallDisplayIcon={app}\uninstall.exe
Uninstallable=yes

[Languages]
Name: english; MessagesFile: compiler:Default.isl

[Tasks]
Name: desktopicon; Description: {cm:CreateDesktopIcon}; GroupDescription: {cm:AdditionalIcons}; Flags: unchecked

[Files]
Source: "*"; DestDir: {tmp}\MyProject; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "scripts\run_installer.bat"; DestDir: {app}; Flags: ignoreversion
; Uninstall files
Source: {tmp}\MyProject\*"; DestDir: {app}; Flags: ignoreversion recursesubdirs uninsrestartdelete
Source: "scripts\create_installer.ps1"; DestDir: {app}; Flags: ignoreversion

[Icons]
Name: {autoprograms}\MyProject; Filename: {app}\run_installer.bat;
Name: {autodesktop}\MyProject; Filename: {app}\run_installer.bat; Tasks: desktopicon

[Run]
Filename: {app}\run_installer.bat; Description: {cm:LaunchProgram,MyProject}; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: {app}
Type: files; Name: {app}\frontend-start.log

[Code]
procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
var
  ErrorCode: Integer;
begin
  if CurUninstallStep = usUninstall then
  begin
    // Stop the frontend before uninstalling.
    Exec(ExpandConstant('{app}\uninstall.ps1'), '', '', SW_HIDE, ewWaitUntilTerminated, ErrorCode);
    if ErrorCode <> 0 then
    begin
      MsgBox('Failed to run the uninstallation script.', mbError, MB_OK);
    end;
  end;
end;