param(
  [Parameter(Mandatory=$true)][string]$InputPath,
  [Parameter(Mandatory=$true)][string]$OutputPath,
  [int]$YMin = 0,
  [int]$XMin = 0,
  [int]$YMax = 1000,
  [int]$XMax = 1000,
  [string]$Mode = "clean_crop"
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
    private static GraphicsPath RoundedRect(Rectangle bounds, int radius) {
        int d = radius * 2;
        GraphicsPath path = new GraphicsPath();
        if (radius <= 0) {
            path.AddRectangle(bounds);
            return path;
        }
        path.AddArc(bounds.X, bounds.Y, d, d, 180, 90);
        path.AddArc(bounds.Right - d, bounds.Y, d, d, 270, 90);
        path.AddArc(bounds.Right - d, bounds.Bottom - d, d, d, 0, 90);
        path.AddArc(bounds.X, bounds.Bottom - d, d, d, 90, 90);
        path.CloseFigure();
        return path;
    }

    private static ImageCodecInfo GetJpegEncoder() {
        foreach (ImageCodecInfo codec in ImageCodecInfo.GetImageEncoders()) {
            if (codec.MimeType == "image/jpeg") return codec;
        }
        return null;
    }

    private static void SaveJpeg(Bitmap bmp, string outPath) {
        ImageCodecInfo jpgEncoder = GetJpegEncoder();
        if (jpgEncoder != null) {
            EncoderParameters ep = new EncoderParameters(1);
            ep.Param[0] = new EncoderParameter(Encoder.Quality, 95L);
            bmp.Save(outPath, jpgEncoder, ep);
        } else {
            bmp.Save(outPath, ImageFormat.Jpeg);
        }
    }

    public static void Process(string inPath, string outPath, int ymin, int xmin, int ymax, int xmax, string mode) {
        string m = (mode ?? "clean_crop").Trim().ToLowerInvariant();
        if (m == "original_framed") {
            ymin = 0; xmin = 0; ymax = 1000; xmax = 1000;
        }

        using (Bitmap src = new Bitmap(inPath)) {
            int w = src.Width;
            int h = src.Height;

            int pad = (m == "white_cutout") ? 4 : 0;
            int cx = Math.Max(0, (int)Math.Round(w * xmin / 1000.0) - pad);
            int cy = Math.Max(0, (int)Math.Round(h * ymin / 1000.0) - pad);
            int cr = Math.Min(w, (int)Math.Round(w * xmax / 1000.0) + pad);
            int cb = Math.Min(h, (int)Math.Round(h * ymax / 1000.0) + pad);
            int cw = Math.Max(16, cr - cx);
            int ch = Math.Max(16, cb - cy);

            using (Bitmap cropped = new Bitmap(cw, ch, PixelFormat.Format32bppArgb)) {
                using (Graphics gc = Graphics.FromImage(cropped)) {
                    gc.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    gc.SmoothingMode = SmoothingMode.HighQuality;
                    gc.DrawImage(src, new Rectangle(0, 0, cw, ch), new Rectangle(cx, cy, cw, ch), GraphicsUnit.Pixel);
                }

                if (m == "white_cutout") {
                    RenderWhiteCutout(cropped, outPath, cw, ch);
                } else {
                    RenderCleanCard(cropped, outPath, cw, ch, m == "original_framed");
                }
            }
        }
    }

    private static void RenderCleanCard(Bitmap cropped, string outPath, int cw, int ch, bool fullFrame) {
        int canvasSize = 1000;
        using (Bitmap canvas = new Bitmap(canvasSize, canvasSize, PixelFormat.Format24bppRgb))
        using (Graphics g = Graphics.FromImage(canvas)) {
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.Clear(Color.White);

            double maxDim = fullFrame ? 880.0 : 850.0;
            double scale = Math.Min(maxDim / cw, maxDim / ch);
            int dw = Math.Max(20, (int)Math.Round(cw * scale));
            int dh = Math.Max(20, (int)Math.Round(ch * scale));
            int dxPos = (canvasSize - dw) / 2;
            int dyPos = (canvasSize - dh) / 2 - 8;

            // Soft realistic floor contact shadow below product card
            using (GraphicsPath sp = new GraphicsPath()) {
                sp.AddEllipse(dxPos + (int)(dw * 0.06), dyPos + dh - 12, (int)(dw * 0.88), 34);
                using (PathGradientBrush pgb = new PathGradientBrush(sp)) {
                    pgb.CenterColor = Color.FromArgb(44, 15, 23, 42);
                    pgb.SurroundColors = new Color[] { Color.FromArgb(0, 255, 255, 255) };
                    g.FillPath(pgb, sp);
                }
            }

            Rectangle rect = new Rectangle(dxPos, dyPos, dw, dh);
            int radius = fullFrame ? 18 : 22;
            using (GraphicsPath clipPath = RoundedRect(rect, radius)) {
                GraphicsState saved = g.Save();
                g.SetClip(clipPath);
                using (ImageAttributes attr = new ImageAttributes()) {
                    float c = 1.05f;
                    float br = 0.015f;
                    ColorMatrix cm = new ColorMatrix(new float[][] {
                        new float[] { c, 0, 0, 0, 0 },
                        new float[] { 0, c, 0, 0, 0 },
                        new float[] { 0, 0, c, 0, 0 },
                        new float[] { 0, 0, 0, 1, 0 },
                        new float[] { br, br, br, 0, 1 }
                    });
                    attr.SetColorMatrix(cm);
                    g.DrawImage(cropped, rect, 0, 0, cw, ch, GraphicsUnit.Pixel, attr);
                }
                g.Restore(saved);
                using (Pen borderPen = new Pen(Color.FromArgb(235, 238, 244), 1.5f)) {
                    g.DrawPath(borderPen, clipPath);
                }
            }

            SaveJpeg(canvas, outPath);
        }
    }

    private static void RenderWhiteCutout(Bitmap cropped, string outPath, int cw, int ch) {
        BitmapData bd = cropped.LockBits(new Rectangle(0, 0, cw, ch), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        int stride = bd.Stride;
        int totalBytes = stride * ch;
        byte[] buf = new byte[totalBytes];
        Marshal.Copy(bd.Scan0, buf, 0, totalBytes);

        // Compute luminance and Sobel edge magnitude so flood-fill never crosses strong object edges
        int[] lumMap = new int[cw * ch];
        for (int y = 0; y < ch; y++) {
            for (int x = 0; x < cw; x++) {
                int off = y * stride + x * 4;
                lumMap[y * cw + x] = (buf[off + 2] * 299 + buf[off + 1] * 587 + buf[off] * 114) / 1000;
            }
        }

        int[] edgeMag = new int[cw * ch];
        for (int y = 1; y < ch - 1; y++) {
            for (int x = 1; x < cw - 1; x++) {
                int gx = -lumMap[(y - 1) * cw + (x - 1)] + lumMap[(y - 1) * cw + (x + 1)]
                         - 2 * lumMap[y * cw + (x - 1)] + 2 * lumMap[y * cw + (x + 1)]
                         - lumMap[(y + 1) * cw + (x - 1)] + lumMap[(y + 1) * cw + (x + 1)];
                int gy = -lumMap[(y - 1) * cw + (x - 1)] - 2 * lumMap[(y - 1) * cw + x] - lumMap[(y - 1) * cw + (x + 1)]
                         + lumMap[(y + 1) * cw + (x - 1)] + 2 * lumMap[(y + 1) * cw + x] + lumMap[(y + 1) * cw + (x + 1)];
                edgeMag[y * cw + x] = (Math.Abs(gx) + Math.Abs(gy)) / 4;
            }
        }

        bool[] visited = new bool[cw * ch];
        Queue<int> q = new Queue<int>();
        byte[] seedR = new byte[cw * ch];
        byte[] seedG = new byte[cw * ch];
        byte[] seedB = new byte[cw * ch];

        Action<int, int> trySeed = (x, y) => {
            int idx = y * cw + x;
            if (visited[idx] || edgeMag[idx] >= 36) return;
            int off = y * stride + x * 4;
            byte b = buf[off], g = buf[off + 1], r = buf[off + 2];
            int maxC = Math.Max(r, Math.Max(g, b));
            int minC = Math.Min(r, Math.Min(g, b));
            int lum = lumMap[idx];
            // Light neutral paper/cardboard OR strong colored cardboard border (e.g. green/blue box print)
            bool isLightNeutral = lum >= 188 && (maxC - minC) < 30;
            bool isColoredCardboard = (maxC - minC) >= 24 && (g > r + 15 || b > r + 15 || r > g + 22);
            if (isLightNeutral || isColoredCardboard) {
                visited[idx] = true;
                seedR[idx] = r;
                seedG[idx] = g;
                seedB[idx] = b;
                q.Enqueue(idx);
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
            byte sr = seedR[idx], sg = seedG[idx], sb = seedB[idx];
            buf[off + 3] = 0;

            for (int k = 0; k < 4; k++) {
                int nx = x + dx[k];
                int ny = y + dy[k];
                if (nx < 0 || ny < 0 || nx >= cw || ny >= ch) continue;
                int nidx = ny * cw + nx;
                if (visited[nidx] || edgeMag[nidx] >= 38) continue;

                int noff = ny * stride + nx * 4;
                byte nb = buf[noff], ng = buf[noff + 1], nr = buf[noff + 2];
                int stepDiff = Math.Abs(nr - pr) + Math.Abs(ng - pg) + Math.Abs(nb - pb);
                int seedDiff = Math.Abs(nr - sr) + Math.Abs(ng - sg) + Math.Abs(nb - sb);

                if (stepDiff <= 22 && seedDiff <= 54) {
                    visited[nidx] = true;
                    seedR[nidx] = sr;
                    seedG[nidx] = sg;
                    seedB[nidx] = sb;
                    q.Enqueue(nidx);
                }
            }
        }

        byte[] alphaCopy = new byte[cw * ch];
        for (int y = 0; y < ch; y++) {
            for (int x = 0; x < cw; x++) {
                alphaCopy[y * cw + x] = buf[y * stride + x * 4 + 3];
            }
        }
        for (int y = 1; y < ch - 1; y++) {
            for (int x = 1; x < cw - 1; x++) {
                if (alphaCopy[y * cw + x] == 255) {
                    int t = 0;
                    if (alphaCopy[y * cw + (x - 1)] == 0) t++;
                    if (alphaCopy[y * cw + (x + 1)] == 0) t++;
                    if (alphaCopy[(y - 1) * cw + x] == 0) t++;
                    if (alphaCopy[(y + 1) * cw + x] == 0) t++;
                    if (t >= 1) {
                        buf[y * stride + x * 4 + 3] = (byte)(t >= 2 ? 120 : 195);
                    }
                }
            }
        }

        Marshal.Copy(buf, 0, bd.Scan0, totalBytes);
        cropped.UnlockBits(bd);

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

        int canvasSize = 1000;
        using (Bitmap canvas = new Bitmap(canvasSize, canvasSize, PixelFormat.Format24bppRgb))
        using (Graphics g = Graphics.FromImage(canvas)) {
            g.SmoothingMode = SmoothingMode.HighQuality;
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = PixelOffsetMode.HighQuality;
            g.Clear(Color.White);

            double scale = Math.Min(830.0 / fgW, 830.0 / fgH);
            int dw = Math.Max(20, (int)Math.Round(fgW * scale));
            int dh = Math.Max(20, (int)Math.Round(fgH * scale));
            int dxPos = (canvasSize - dw) / 2;
            int dyPos = (canvasSize - dh) / 2 - 10;

            using (GraphicsPath sp = new GraphicsPath()) {
                sp.AddEllipse(dxPos + (int)(dw * 0.08), dyPos + dh - 12, (int)(dw * 0.84), 34);
                using (PathGradientBrush pgb = new PathGradientBrush(sp)) {
                    pgb.CenterColor = Color.FromArgb(44, 15, 23, 42);
                    pgb.SurroundColors = new Color[] { Color.FromArgb(0, 255, 255, 255) };
                    g.FillPath(pgb, sp);
                }
            }

            using (ImageAttributes attr = new ImageAttributes()) {
                float c = 1.05f;
                float br = 0.015f;
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

            SaveJpeg(canvas, outPath);
        }
    }
}
"@

Add-Type -TypeDefinition $csharp -ReferencedAssemblies System.Drawing
[StudioPhotoProcessor]::Process($InputPath, $OutputPath, $YMin, $XMin, $YMax, $XMax, $Mode)
Write-Output "OK"
