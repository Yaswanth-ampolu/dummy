powershell
#region Install Script

# Set Error Action Preference to Stop on errors
$ErrorActionPreference = "Stop"

# Installation directory
$InstallDir = "$env:ProgramFiles\MyProject"

# Service name
$ServiceName = "MyBackendService"

# Log file path
$LogFile = Join-Path -Path $InstallDir -ChildPath "frontend-start.log"

# Check if the backend server is running and stop it
Write-Host "Checking if the backend server is running..."
try {
    $BackendProcess = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if ($BackendProcess) {
        Write-Host "Backend service is running. Stopping..."
        Stop-Service -Name $ServiceName -Force
        Write-Host "Backend service stopped."
    } else {
        Write-Host "Backend service is not running."
    }
} catch {
    Write-Error "Failed to check or stop the backend service: $_"
    exit 1
}

# Create the installation directory if it doesn't exist
Write-Host "Creating installation directory: $InstallDir"
if (!(Test-Path -Path $InstallDir)) {
    try {
        New-Item -ItemType Directory -Path $InstallDir | Out-Null
        Write-Host "Installation directory created."
    } catch {
        Write-Error "Failed to create installation directory: $_"
        exit 1
    }
}

# Copy files to the installation directory
Write-Host "Copying files to installation directory..."
try {
    Copy-Item -Path ".\*" -Destination $InstallDir -Recurse -Force
    Write-Host "Files copied successfully."
} catch {
    Write-Error "Failed to copy files to installation directory: $_"
    exit 1
}

# Install the backend as a service
Write-Host "Installing backend as a service..."
try {
    $ServicePath = Join-Path -Path $InstallDir -ChildPath "src\backend\server.js"
    $ServiceCmd = "node `"$ServicePath`""
    New-Service -Name $ServiceName -BinaryPathName $ServiceCmd -DisplayName $ServiceName -StartupType Manual
    Write-Host "Backend service installed."
} catch {
    Write-Error "Failed to install the backend service: $_"
    exit 1
}

# Set the service startup type to Automatic
Write-Host "Setting service startup type to Automatic..."
try {
    Set-Service -Name $ServiceName -StartupType Automatic
    Write-Host "Service startup type set to Automatic."
} catch {
    Write-Error "Failed to set service startup type: $_"
    exit 1
}

# Start the service
Write-Host "Starting the backend service..."
try {
    Start-Service -Name $ServiceName
    Write-Host "Backend service started."
} catch {
    Write-Error "Failed to start the backend service: $_"
    exit 1
}

# Start the frontend
Write-Host "Starting the frontend..."
try {
    $FrontendPath = Join-Path -Path $InstallDir -ChildPath "src\app"
    Start-Process -FilePath "npm.cmd" -ArgumentList "run", "start" -WorkingDirectory $FrontendPath -RedirectStandardOutput $LogFile -RedirectStandardError $LogFile -WindowStyle Hidden -NoNewWindow
    Write-Host "Frontend started. Check log file: $LogFile"
} catch {
    Write-Error "Failed to start the frontend: $_"
    exit 1
}

Write-Host "Installation completed successfully."
#endregion

#region Uninstall Script

# Uninstall script
$UninstallScript = @"
# Set Error Action Preference to Stop on errors
\$ErrorActionPreference = "Stop"

# Service name
\$ServiceName = "MyBackendService"

# Installation directory
\$InstallDir = "$InstallDir"

# Log file path
\$LogFile = Join-Path -Path \$InstallDir -ChildPath "frontend-start.log"

# Stop the frontend
Write-Host "Stopping the frontend..."
try {
    Get-Process -Name "node" | Where-Object { \$_.Path -like "*npm*" } | Stop-Process -Force
    Write-Host "Frontend stopped."
} catch {
    Write-Error "Failed to stop the frontend: \$_"
}

# Stop the service
Write-Host "Stopping the backend service..."
try {
    Stop-Service -Name \$ServiceName -Force
    Write-Host "Backend service stopped."
} catch {
    Write-Error "Failed to stop the backend service: \$_"
}

# Remove the service
Write-Host "Removing the backend service..."
try {
    Remove-Service -Name \$ServiceName
    Write-Host "Backend service removed."
} catch {
    Write-Error "Failed to remove the backend service: \$_"
}

# Remove the installation directory and its contents
Write-Host "Removing the installation directory..."
try {
    Remove-Item -Path \$InstallDir -Recurse -Force
    Write-Host "Installation directory removed."
} catch {
    Write-Error "Failed to remove the installation directory: \$_"
}

Write-Host "Uninstallation completed successfully."
"@

# Save the uninstallation script to the installation directory
$UninstallScriptPath = Join-Path -Path $InstallDir -ChildPath "uninstall.ps1"
$UninstallScript | Out-File -FilePath $UninstallScriptPath

Write-Host "Uninstallation script created at: $UninstallScriptPath"

#endregion