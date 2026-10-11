[CmdletBinding()]
param(
    # Apply the safer user-scoped policy only when the learner explicitly requests it.
    [switch]$ApplyUserPolicy,
    # Emit machine-readable JSON for CI and setup scripts instead of a human table.
    [switch]$Json
)

# Require variables to be declared and stop on the first unexpected failure.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Resolve one executable without turning an optional tool into a fatal error.
function Get-CommandPath {
    param([Parameter(Mandatory)][string]$Name)
    $command = Get-Command $Name -ErrorAction SilentlyContinue
    if ($null -eq $command) { return $null }
    return $command.Source
}

# Change only the current user's execution policy when explicitly requested.
if ($ApplyUserPolicy) {
    Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
}

# Capture the protocol setting currently visible to this PowerShell process.
$tls = [Net.ServicePointManager]::SecurityProtocol
# Build one structured audit record so every platform reports the same fields.
$report = [ordered]@{
    ComputerName = $env:COMPUTERNAME
    PowerShell = $PSVersionTable.PSVersion.ToString()
    ExecutionPolicy = (Get-ExecutionPolicy -Scope CurrentUser).ToString()
    TlsProtocol = $tls.ToString()
    Node = Get-CommandPath -Name 'node'
    Npm = Get-CommandPath -Name 'npm'
    NpmCmd = Get-CommandPath -Name 'npm.cmd'
    Pnpm = Get-CommandPath -Name 'pnpm'
    Corepack = Get-CommandPath -Name 'corepack'
    Python = Get-CommandPath -Name 'python'
    Pip = Get-CommandPath -Name 'pip'
    Git = Get-CommandPath -Name 'git'
    Scoop = Get-CommandPath -Name 'scoop'
    Winget = Get-CommandPath -Name 'winget'
    Choco = Get-CommandPath -Name 'choco'
    Docker = Get-CommandPath -Name 'docker'
    Gh = Get-CommandPath -Name 'gh'
    PathEntries = ($env:Path -split ';' | Where-Object { $_ -and (Test-Path $_) })
}

# Select JSON for automation or readable key/value output for a learner.
if ($Json) {
    $report | ConvertTo-Json -Depth 4
} else {
    $report.GetEnumerator() | ForEach-Object { '{0}: {1}' -f $_.Key, $_.Value }
}
