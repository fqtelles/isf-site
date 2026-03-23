# ============================================================
#  Script: upload-imagens.ps1
#  Envia as imagens dos produtos quebrados para a VPS
#  Execute no PowerShell do Windows:
#    .\upload-imagens.ps1
# ============================================================

$backup = "C:\Users\Felipe\OneDrive\Documents\backup-3.20.2026_07-23-17_isfcom73\backup-3.20.2026_07-23-17_isfcom73\homedir\public_html\wp-content\uploads\2020\10"
$vps    = "root@45.85.146.56:/home/user/isf-site/public/"

$files = @(
    "SENSOR-BARREIRA-ATIVO-DUPLO-FEIXE-30MTS-PB-30HD-AJUSTE-A-LASER-DETECTOR-IMP-.jpg",
    "SENSOR-ATIVO-IVA-7100-HEXA.jpg",
    "Central-de-cerca-eletrica.jpg",
    "Modulo-de-choque.jpg",
    "HASTE-INDUSTRIAL-ALUMINIO-25X25-1.00-MT-6-ISOL-`u{2013}-CONFISEG.jpg",
    "CABO-DE-ACO-AF-ALMA-DE-FIBRA-GALVANIZADO-1-16-6X7-100MTS-.jpg",
    "Controle-remoto-XAC-4000-Smart-control.jpg"
)

Write-Host "`n=== Upload de imagens para a VPS ===" -ForegroundColor Cyan

foreach ($file in $files) {
    $src = Join-Path $backup $file
    if (Test-Path $src) {
        Write-Host "Enviando: $file" -ForegroundColor Yellow
        scp "$src" $vps
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  OK" -ForegroundColor Green
        } else {
            Write-Host "  FALHOU" -ForegroundColor Red
        }
    } else {
        Write-Host "ARQUIVO NAO ENCONTRADO: $src" -ForegroundColor Red
    }
}

Write-Host "`nConcluido! Agora rode no servidor:" -ForegroundColor Cyan
Write-Host "  node /home/user/isf-site/update-db-imagens.js" -ForegroundColor White
