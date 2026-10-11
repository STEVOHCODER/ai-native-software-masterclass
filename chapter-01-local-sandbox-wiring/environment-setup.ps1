[CmdletBinding()]
param(
    [switch]$ApplyUserPolicy
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
    Pnpm = Get-CommandPath -Name 'pnpm'
    Python = Get-CommandPath -Name 'python'
    Git = Get-CommandPath -Name 'git'
    Scoop = Get-CommandPath -Name 'scoop'
    PathEntries = ($env:Path -split ';' | Where-Object { $_ -and (Test-Path $_) })
}

$report | ConvertTo-Json -Depth 4

