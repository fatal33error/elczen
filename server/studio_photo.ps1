param(
  [Parameter(Mandatory=$true)][string]$InputPath,
  [Parameter(Mandatory=$true)][string]$OutputPath,
  [int]$YMin = 0,
  [int]$XMin = 0,
  [int]$YMax = 1000,
  [int]$XMax = 1000
)

Add-Type -AssemblyName System.Drawing

$csharp = @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class StudioPhotoProcessor {
    public static void Process(string inPath, string outPath, int ymin, int xmin, int ymax, int xmax) {
        using (Bitmap src = new Bitmap(inPath)) {
            int w = src.Width;
            int h = src.Height;

            int cx = Math.Max(0, (int)Math.Round(w * xmin / 1000.0) - 8);
            int cy = Math.Max(0, (int)Math.Round(h * ymin / 1000.0) - 8);
            int cr = Math.Min(w, (int)Math.Round(w * xmax / 1000.0) + 8);
            int cb = Math.Min(h, (int)Math.Round(h * ymax / 1000.0) + 8);
            int cw = Math.Max(16, cr - cx);
            int ch = Math.Max(16, cb - cy);

            using (Bitmap cropped = new Bitmap(cw, ch, PixelFormat.Format32bppArgb)) {
                using (Graphics gc = Graphics.FromImage(cropped)) {
                    gc.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    gc.DrawImage(src, new Rectangle(0, 0, cw, ch), new Rectangle(cx, cy, cw, ch), GraphicsUnit.Pixel);
                }

                // Border-connected adaptive background flood-fill removal
                BitmapData bd = cropped.LockBits(new Rectangle(0, 0, cw, ch), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
                int stride = bd.Stride;
                int totalBytes = stride * ch;
                byte[] buf = new byte[totalBytes];
                Marshal.Copy(bd.Scan0, buf, 0, totalBytes);

                bool[] visited = new bool[cw * ch];
                Queue<int> q = new Queue<int>();

                // Enqueue all 4 borders if brightness/uniformity matches background or perimeter color
                // First compute average corner brightness to avoid eating dark/colored product edges touching border
                Action<int, int> trySeed = (x, y) => {
                    int off = y * stride + x * 4;
                    byte b = buf[off], g = buf[off + 1], r = buf[off + 2];
                    int lum = (r * 299 + g * 587 + b * 114) / 1000;
                    int maxC = Math.Max(r, Math.Max(g, b));
                    int minC = Math.Min(r, Math.Min(g, b));
                    // Neutral light background OR solid green/blue cardboard edge
                    bool isLightBg = lum >= 155 && (maxC - minC) < 42;
                    bool isGreenCardboard = (g > r + 18 && g > b + 12 && lum < 190);
                    if (isLightBg || isGreenCardboard) {
                        int idx = y * cw + x;
                        if (!visited[idx]) {
                            visited[idx] = true;
                            q.Enqueue(idx);
                        }
                    }
                };

                for (int x = 0; x < cw; x++) {
                    trySeed(x, 0);
                    trySeed(x, ch - 1);
                }
                for (int y = 0; y < ch; y++) {
                    trySeed(0, y);
                    trySeed(cw - 1, y);
                }

                int[] dx = { -1, 1, 0, 0 };
                int[] dy = { 0, 0, -1, 1 };

                while (q.Count > 0) {
                    int idx = q.Dequeue();
                    int x = idx % cw;
                    int y = idx / cw;
                    int off = y * stride + x * 4;
                    byte pb = buf[off], pg = buf[off + 1], pr = buf[off + 2];
                    buf[off + 3] = 0; // transparent

                    for (int k = 0; k < 4; k++) {
                        int nx = x + dx[k];
                        int ny = y + dy[k];
                        if (nx < 0 || ny < 0 || nx >= cw || ny >= ch) continue;
                        int nidx = ny * cw + nx;
                        if (visited[nidx]) continue;

                        int noff = ny * stride + nx * 4;
                        byte nb = buf[noff], ng = buf[noff + 1], nr = buf[noff + 2];
                        int diff = Math.Abs(nr - pr) + Math.Abs(ng - pg) + Math.Abs(nb - pb);
                        int nlum = (nr * 299 + ng * 587 + nb * 114) / 1000;
                        int nMax = Math.Max(nr, Math.Max(ng, nb));
                        int nMin = Math.Min(nr, Math.Min(ng, nb));
                        bool similarStep = diff <= 45;
                        bool looksBg = (nlum >= 165 && (nMax - nMin) < 42) || (ng > nr + 18 && ng > nb + 12);

                        if (similarStep && looksBg) {
                            visited[nidx] = true;
                            q.Enqueue(nidx);
                        }
                    }
                }

                // Anti-aliased 1px edge feathering where alpha=255 neighbors alpha=0
                byte[] alphaCopy = new byte[cw * ch];
                for (int y = 0; y < ch; y++) {
                    for (int x = 0; x < cw; x++) {
                        alphaCopy[y * cw + x] = buf[y * stride + x * 4 + 3];
                    }
                }
                for (int y = 1; y < ch - 1; y++) {
                    for (int x = 1; x < cw - 1; x++) {
                        if (alphaCopy[y * cw + x] == 255) {
                            int transparentNeighbors = 0;
                            if (alphaCopy[y * cw + (x - 1)] == 0) transparentNeighbors++;
                            if (alphaCopy[y * cw + (x + 1)] == 0) transparentNeighbors++;
                            if (alphaCopy[(y - 1) * cw + x] == 0) transparentNeighbors++;
                            if (alphaCopy[(y + 1) * cw + x] == 0) transparentNeighbors++;
                            if (transparentNeighbors >= 1) {
                                int off = y * stride + x * 4;
                                buf[off + 3] = (byte)(transparentNeighbors >= 2 ? 120 : 195);
                            }
                        }
                    }
                }

                Marshal.Copy(buf, 0, bd.Scan0, totalBytes);
                cropped.UnlockBits(bd);

                // Find tightest non-transparent bounding box
                int minX = cw, minY = ch, maxX = 0, maxY = 0;
                for (int y = 0; y < ch; y++) {
                    for (int x = 0; x < cw; x++) {
                        if (alphaCopy[y * cw + x] > 0) {
                            if (x < minX) minX = x;
                            if (x > maxX) maxX = x;
                            if (y < minY) minY = y;
                            if (y > maxY) maxY = y;
                        }
                    }
                }
                if (maxX <= minX || maxY <= minY) {
                    minX = 0; minY = 0; maxX = cw - 1; maxY = ch - 1;
                }
                int fgW = maxX - minX + 1;
                int fgH = maxY - minY + 1;

                // Render centered on 1000x1000 pure white studio backdrop with realistic shadow + studio tone
                int canvasSize = 1000;
                using (Bitmap canvas = new Bitmap(canvasSize, canvasSize, PixelFormat.Format24bppRgb))
                using (Graphics g = Graphics.FromImage(canvas)) {
                    g.SmoothingMode = SmoothingMode.HighQuality;
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.Clear(Color.White);

                    double scale = Math.Min(820.0 / fgW, 820.0 / fgH);
                    int dw = (int)Math.Round(fgW * scale);
                    int dh = (int)Math.Round(fgH * scale);
                    int dxPos = (canvasSize - dw) / 2;
                    int dyPos = (canvasSize - dh) / 2 - 12;

                    using (GraphicsPath sp = new GraphicsPath()) {
                        sp.AddEllipse(dxPos + (int)(dw * 0.08), dyPos + dh - 14, (int)(dw * 0.84), 38);
                        using (PathGradientBrush pgb = new PathGradientBrush(sp)) {
                            pgb.CenterColor = Color.FromArgb(46, 15, 23, 42);
                            pgb.SurroundColors = new Color[] { Color.FromArgb(0, 255, 255, 255) };
                            g.FillPath(pgb, sp);
                        }
                    }

                    using (ImageAttributes attr = new ImageAttributes()) {
                        float c = 1.07f;
                        float br = 0.02f;
                        ColorMatrix cm = new ColorMatrix(new float[][] {
                            new float[] { c, 0, 0, 0, 0 },
                            new float[] { 0, c, 0, 0, 0 },
                            new float[] { 0, 0, c, 0, 0 },
                            new float[] { 0, 0, 0, 1, 0 },
                            new float[] { br, br, br, 0, 1 }
                        });
                        attr.SetColorMatrix(cm);
                        g.DrawImage(cropped, new Rectangle(dxPos, dyPos, dw, dh), minX, minY, fgW, fgH, GraphicsUnit.Pixel, attr);
                    }

                    ImageCodecInfo jpgEncoder = null;
                    foreach (ImageCodecInfo codec in ImageCodecInfo.GetImageEncoders()) {
                        if (codec.MimeType == "image/jpeg") { jpgEncoder = codec; break; }
                    }
                    EncoderParameters ep = new EncoderParameters(1);
                    ep.Param[0] = new EncoderParameter(Encoder.Quality, 95L);
                    canvas.Save(outPath, jpgEncoder, ep);
                }
            }
        }
    }
}
"@

Add-Type -TypeDefinition $csharp -ReferencedAssemblies System.Drawing
[StudioPhotoProcessor]::Process($InputPath, $OutputPath, $YMin, $XMin, $YMax, $XMax)
Write-Output "OK"
