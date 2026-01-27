Add-Type -AssemblyName System.Drawing

function Get-JpegEncoder {
  return [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
}

function Save-Jpeg {
  param(
    [string]$Source,
    [string]$Destination,
    [Nullable[int]]$CropX = $null,
    [Nullable[int]]$CropY = $null,
    [Nullable[int]]$CropW = $null,
    [Nullable[int]]$CropH = $null,
    [int]$Quality = 92
  )

  $image = [System.Drawing.Image]::FromFile($Source)
  try {
    if ($CropX -ne $null -and $CropY -ne $null -and $CropW -ne $null -and $CropH -ne $null) {
      $rect = New-Object System.Drawing.Rectangle($CropX, $CropY, $CropW, $CropH)
      $bitmap = New-Object System.Drawing.Bitmap($rect.Width, $rect.Height)
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $graphics.DrawImage($image, 0, 0, $rect, [System.Drawing.GraphicsUnit]::Pixel)
      $graphics.Dispose()
      $target = $bitmap
    } else {
      $target = $image
    }

    $encoder = Get-JpegEncoder
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
    $target.Save($Destination, $encoder, $encoderParams)

    if ($target -ne $image) {
      $target.Dispose()
    }
  } finally {
    $image.Dispose()
  }
}

$root = 'D:\wajil\public\assets\images'

$sourceHero = Join-Path $root 'img1-hero-16x9.png'
$sourceHeroMobile = Join-Path $root '20260126_1728_Image Generation_remix_01kfya5jpce3pac2hcybbr4ync.png'
$sourceTexture = Join-Path $root '20260127_1054_Image Generation_simple_compose_01kg060k3ke1atbb178pz0gp8k.png'
$sourcePattern = Join-Path $root '20260127_1055_Image Generation_simple_compose_01kg062hsefvyvg1fcnkw3hywd.png'
$sourceOrigin = Join-Path $root '20260127_1056_Image Generation_simple_compose_01kg064hfeea99ykmzn0r8d6aj.png'
$sourceWrapped = Join-Path $root '20260127_1100_Image Generation_simple_compose_01kg06b5vbfv9vevdbs2jdvees.png'
$sourceTextureFood = Join-Path $root '20260127_1116_Image Generation_simple_compose_01kg078m0xfmav494tae6a0a1b.png'

Save-Jpeg -Source $sourceHero -Destination (Join-Path $root 'img1-hero-16x9.jpg')
Save-Jpeg -Source $sourceHeroMobile -Destination (Join-Path $root 'img1-hero-9x16.jpg')
Save-Jpeg -Source $sourceTexture -Destination (Join-Path $root 'img2-texture.jpg')
Save-Jpeg -Source $sourcePattern -Destination (Join-Path $root 'img3-pattern.jpg')
Save-Jpeg -Source $sourceOrigin -Destination (Join-Path $root 'img4-origin.jpg')
Save-Jpeg -Source $sourceWrapped -Destination (Join-Path $root 'img5-square.jpg')
Save-Jpeg -Source $sourceTextureFood -Destination (Join-Path $root 'img6-square.jpg')

# Crop a square from the right side of the hero for the "Servido" product.
Save-Jpeg -Source $sourceHero -Destination (Join-Path $root 'img1-square.jpg') -CropX 512 -CropY 0 -CropW 1024 -CropH 1024
