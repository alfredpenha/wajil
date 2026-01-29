Add-Type -AssemblyName System.Drawing

$size = 64
$bg = [System.Drawing.Color]::FromArgb(8, 8, 8)
$gold = [System.Drawing.Color]::FromArgb(196, 166, 71)

$bitmap = New-Object System.Drawing.Bitmap $size, $size
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.Clear($bg)

$pen = New-Object System.Drawing.Pen($gold, 6)
$pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

$points = New-Object 'System.Drawing.PointF[]' 5
$points[0] = New-Object System.Drawing.PointF(12, 16)
$points[1] = New-Object System.Drawing.PointF(24, 46)
$points[2] = New-Object System.Drawing.PointF(32, 28)
$points[3] = New-Object System.Drawing.PointF(40, 46)
$points[4] = New-Object System.Drawing.PointF(52, 16)
$graphics.DrawLines($pen, $points)

$graphics.Dispose()
$pen.Dispose()

$stream = New-Object System.IO.MemoryStream
$bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
$bitmap.Dispose()

$pngBytes = $stream.ToArray()
$stream.Dispose()

$iconPath = 'D:\wajil\public\favicon.ico'
$fs = [System.IO.File]::Open($iconPath, [System.IO.FileMode]::Create)
$bw = New-Object System.IO.BinaryWriter($fs)

$bw.Write([UInt16]0)
$bw.Write([UInt16]1)
$bw.Write([UInt16]1)
$bw.Write([Byte]$size)
$bw.Write([Byte]$size)
$bw.Write([Byte]0)
$bw.Write([Byte]0)
$bw.Write([UInt16]1)
$bw.Write([UInt16]32)
$bw.Write([UInt32]$pngBytes.Length)
$bw.Write([UInt32]22)
$bw.Write($pngBytes)

$bw.Close()
$fs.Close()
