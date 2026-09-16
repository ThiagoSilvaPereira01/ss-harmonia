Add-Type -AssemblyName System.Drawing

$src = "c:\Users\thiag\Documents\ss harmonia\ss-harmonia\assets\logo-vertical-bordo.png"
$assetsDir = "c:\Users\thiag\Documents\ss harmonia\ss-harmonia\assets"

$bmp = [System.Drawing.Bitmap]::FromFile($src)
$width = $bmp.Width
$height = $bmp.Height

# Sample background color near corners (e.g. at 10, 10)
$bgSample = $bmp.GetPixel(10, 10)
Write-Host "Sampled BG color: R=$($bgSample.R), G=$($bgSample.G), B=$($bgSample.B)"

# Background is roughly around R=100, G=29, B=46 (Bordo)
# Foreground text is around R=226, G=218, B=199 (Areia / cream)

# Create Transparent Light Logo (Areia elements, transparent background)
$bmpLight = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Create Transparent Dark Logo (Marrom/Bordo elements, transparent background)
$bmpDark = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        
        # Distance from background color
        # In Bordo bg, R is around 90-110, G is around 20-35, B is around 40-55
        # The luminance or distance from cream vs bordo
        # Cream text has high G (> 150) and high B (> 130) and high R (> 180)
        # Whereas Bordo background has low G (< 60) and low B (< 75)
        
        # Let's calculate closeness to foreground (cream: ~226, 218, 199) vs background (~99, 27, 45)
        # Specifically, G is 28 in bg and 218 in fg! That's a 190-point spread.
        $fgFactor = ($c.G - 28) / (218 - 28)
        if ($fgFactor -lt 0) { $fgFactor = 0 }
        if ($fgFactor -gt 1) { $fgFactor = 1 }

        # Smooth alpha thresholding for perfect antialiasing
        $alpha = 0
        if ($fgFactor -gt 0.15) {
            $t = ($fgFactor - 0.15) / (0.85 - 0.15)
            if ($t -gt 1) { $t = 1 }
            $alpha = [int]($t * 255)
        }

        if ($alpha -gt 0) {
            # Light version: Areia cream color (#e2dac7) with alpha
            # Or preserve original pixel color with alpha
            $colorLight = [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B)
            $bmpLight.SetPixel($x, $y, $colorLight)

            # Dark version: Marrom (#422820) with alpha
            $colorDark = [System.Drawing.Color]::FromArgb($alpha, 66, 40, 32)
            $bmpDark.SetPixel($x, $y, $colorDark)
        } else {
            $bmpLight.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            $bmpDark.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

$bmpLight.Save("$assetsDir\logo-transparent-light.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmpDark.Save("$assetsDir\logo-transparent-dark.png", [System.Drawing.Imaging.ImageFormat]::Png)

Write-Host "Exported logo-transparent-light.png and logo-transparent-dark.png"

# Now let's crop the circular seal from top center of $bmpDark to create favicon and seal icon
# Seal is roughly centered at X around 445, Y from ~20 to ~240
# Let's crop a bounding box of 300x260 centered horizontally
$sealX = [int](($width - 260) / 2)
$sealY = 15
$sealW = 260
$sealH = 240

$rectSeal = New-Object System.Drawing.Rectangle($sealX, $sealY, $sealW, $sealH)
$sealDark = $bmpDark.Clone($rectSeal, $bmpDark.PixelFormat)
$sealDark.Save("$assetsDir\logo-seal-dark.png", [System.Drawing.Imaging.ImageFormat]::Png)

$sealLight = $bmpLight.Clone($rectSeal, $bmpLight.PixelFormat)
$sealLight.Save("$assetsDir\logo-seal-light.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Create 64x64 favicon
$favicon = New-Object System.Drawing.Bitmap(64, 64, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($favicon)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($sealDark, 0, 0, 64, 64)
$g.Dispose()
$favicon.Save("$assetsDir\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$favicon.Dispose()

$sealDark.Dispose()
$sealLight.Dispose()
$bmpLight.Dispose()
$bmpDark.Dispose()
$bmp.Dispose()
Write-Host "Favicon and seals created!"
