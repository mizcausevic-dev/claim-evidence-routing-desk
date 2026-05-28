$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$screenshots = Join-Path $root "screenshots"
New-Item -ItemType Directory -Force -Path $screenshots | Out-Null

Add-Type -AssemblyName System.Drawing

function New-ProofImage {
    param(
        [string]$Path,
        [string]$Title,
        [string]$Subtitle,
        [string[]]$Bullets
    )

    $bitmap = New-Object System.Drawing.Bitmap 1600, 1000
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::FromArgb(7, 10, 15))

    $panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 18, 32))
    $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(55, 255, 139))
    $altAccentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(25, 199, 255))
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(233, 243, 255))
    $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(171, 186, 201))
    $borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(42, 111, 88), 2)

    $graphics.FillRectangle($panelBrush, 48, 48, 1504, 904)
    $graphics.DrawRectangle($borderPen, 48, 48, 1504, 904)

    $eyebrowFont = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
    $titleFont = New-Object System.Drawing.Font("Georgia", 34, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Segoe UI", 18)
    $bulletFont = New-Object System.Drawing.Font("Segoe UI", 20, [System.Drawing.FontStyle]::Bold)

    $graphics.DrawString("Claim Evidence Routing Desk", $eyebrowFont, $accentBrush, 92, 92)
    $graphics.DrawString($Title, $titleFont, $textBrush, 92, 142)
    $graphics.DrawString($Subtitle, $bodyFont, $mutedBrush, 92, 214)

    $y = 320
    foreach ($bullet in $Bullets) {
        $graphics.DrawString("•", $bulletFont, $altAccentBrush, 108, $y)
        $graphics.DrawString($bullet, $bodyFont, $textBrush, 138, $y + 2)
        $y += 82
    }

    $graphics.DrawString("Synthetic proof render for README packaging.", $bodyFont, $mutedBrush, 92, 880)
    $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

New-ProofImage -Path (Join-Path $screenshots "01-overview-proof.png") `
    -Title "Overview proof" `
    -Subtitle "Claim packet health, missing evidence, denial pressure, and appeal posture in one insurance operator surface." `
    -Bullets @(
        "High-severity claim packets surface before denials harden or reimbursement timing slips.",
        "Clinical, coding, eligibility, and appeal evidence stay visible instead of buried in case notes.",
        "Appeal packets make owner-safe routing and escalation timing explicit."
    )

New-ProofImage -Path (Join-Path $screenshots "02-claim-lane-proof.png") `
    -Title "Claim lane" `
    -Subtitle "Every lane keeps owner, packet focus, status, and next action visible." `
    -Bullets @(
        "Intake, clinical, coding, and appeal lanes stay separated cleanly.",
        "Routing drift remains obvious.",
        "Denial-sensitive paths are ready for operator review."
    )

New-ProofImage -Path (Join-Path $screenshots "03-evidence-routing-proof.png") `
    -Title "Evidence routing" `
    -Subtitle "Gaps map severity, owner, claim, principal, and the exact packet that is stale or missing." `
    -Bullets @(
        "Clinical and appeal signals surface first.",
        "Owner mapping keeps revenue-cycle and appeals accountability explicit.",
        "The lane is grounded in reusable claims evidence packets."
    )

New-ProofImage -Path (Join-Path $screenshots "04-appeal-posture-proof.png") `
    -Title "Appeal posture" `
    -Subtitle "Packets tie completeness, blocker, owner, and payer timing together." `
    -Bullets @(
        "Meridian imaging, Harbor continuation, and NovaCare infusion packets stay readable.",
        "Red/yellow/green appeal posture is easy to scan.",
        "The system is shaped for real insurance evidence proof."
    )
