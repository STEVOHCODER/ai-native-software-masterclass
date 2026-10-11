[CmdletBinding()]
param(
    [switch]$ApplyUserPolicy,
    [switch]$Json
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-CommandPath {
    param([Parameter(Mandatory)][string]$Name)
    $command = Get-Command $Name -ErrorAction SilentlyContinue
    if ($null -eq $command) { return $null }
    return $command.Source
}

if ($ApplyUserPolicy) {
    Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
}

$tls = [Net.ServicePointManager]::SecurityProtocol
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

if ($Json) {
    $report | ConvertTo-Json -Depth 4
} else {
    $report.GetEnumerator() | ForEach-Object { '{0}: {1}' -f $_.Key, $_.Value }
}
