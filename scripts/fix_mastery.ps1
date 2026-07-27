$content = Get-Content 'src/pages/TeacherDashboard.jsx' -Raw
$lines = $content -split "`r`n"
# Keep lines 1-5120 (0-indexed: 0..5119) and lines 5376+ (0-indexed: 5375..)
$before = $lines[0..5119]
$after = $lines[5374..($lines.Length-1)]
$result = ($before + $after) -join "`r`n"
[System.IO.File]::WriteAllText((Join-Path $PWD 'src/pages/TeacherDashboard.jsx'), $result)
Write-Host "Done. Removed lines 5121-5375."
