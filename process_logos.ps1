Add-Type -AssemblyName System.Drawing

$src1 = "C:\Users\thiag\.gemini\antigravity\brain\c7642fe7-9ee9-4b4a-b538-69852f9fe512\.user_uploaded\media_1789513387731.png"
$src2 = "C:\Users\thiag\.gemini\antigravity\brain\c7642fe7-9ee9-4b4a-b538-69852f9fe512\.user_uploaded\media_1789513414174.png"

$assetsDir = "c:\Users\thiag\Documents\ss harmonia\ss-harmonia\assets"
if (!(Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir | Out-Null
}

Copy-Item $src1 "$assetsDir\brand-palette-logos.png"
Copy-Item $src2 "$assetsDir\logo-vertical-bordo.png"

$img1 = [System.Drawing.Bitmap]::FromFile($src1)
$img2 = [System.Drawing.Bitmap]::FromFile($src2)

Write-Host "Image 1 size: $($img1.Width)x$($img1.Height)"
Write-Host "Image 2 size: $($img2.Width)x$($img2.Height)"

# Row 2 in image 1 is the Areia background logo (perfect for light header!)
# Total rows: 6 rows
$rowHeight = [int]($img1.Height / 6)
Write-Host "Row height: $rowHeight"

# Crop Row 2: Areia (Light background)
$rectRow2 = New-Object System.Drawing.Rectangle(0, $rowHeight, $img1.Width, $rowHeight)
$bmpRow2 = $img1.Clone($rectRow2, $img1.PixelFormat)
$bmpRow2.Save("$assetsDir\logo-horizontal-areia.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpRow2.Dispose()

# Crop Row 4: Bordo
$rectRow4 = New-Object System.Drawing.Rectangle(0, ($rowHeight * 3), $img1.Width, $rowHeight)
$bmpRow4 = $img1.Clone($rectRow4, $img1.PixelFormat)
$bmpRow4.Save("$assetsDir\logo-horizontal-bordo.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpRow4.Dispose()

# Crop Row 5: Marrom (Dark background, light text)
$rectRow5 = New-Object System.Drawing.Rectangle(0, ($rowHeight * 4), $img1.Width, $rowHeight)
$bmpRow5 = $img1.Clone($rectRow5, $img1.PixelFormat)
$bmpRow5.Save("$assetsDir\logo-horizontal-marrom.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpRow5.Dispose()

# Let's crop the circular seal icon from Image 2 (it's at the top center of Image 2)
# Image 2 has width and height, the circular seal is in the top half
Write-Host "Img2 width: $($img2.Width), height: $($img2.Height)"

$img1.Dispose()
$img2.Dispose()
