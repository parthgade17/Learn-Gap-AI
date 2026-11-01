import os
import struct
import zlib
import math

def make_png(width, height, draw_func):
    """Generate uncompressed RGBA PNG in pure Python with zlib."""
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # filter type 0 (None)
        for x in range(width):
            r, g, b, a = draw_func(x, y, width, height)
            raw_data.extend([r, g, b, a])
            
    compressed = zlib.compress(bytes(raw_data), 9)
    
    png = bytearray(b'\x89PNG\r\n\x1a\n')
    
    # IHDR
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    png.extend(struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc))
    
    # IDAT
    idat_crc = zlib.crc32(b'IDAT' + compressed)
    png.extend(struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc))
    
    # IEND
    iend_crc = zlib.crc32(b'IEND')
    png.extend(struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc))
    
    return bytes(png)

def icon_color(x, y, w, h):
    # Center
    cx, cy = w / 2, h / 2
    dx = x - cx
    dy = y - cy
    dist = math.sqrt(dx*dx + dy*dy)
    radius = w * 0.45
    
    # Rounded squircle background: Emerald Green gradient (#16a34a to #047857)
    corner_r = w * 0.22
    # Check if inside rounded rectangle
    inside_x = abs(dx) <= (w * 0.46 - corner_r)
    inside_y = abs(dy) <= (h * 0.46 - corner_r)
    corner_dist = math.sqrt((abs(dx) - (w * 0.46 - corner_r))**2 + (abs(dy) - (h * 0.46 - corner_r))**2)
    
    is_in_box = (inside_x and abs(dy) <= w * 0.46) or (inside_y and abs(dx) <= h * 0.46) or (corner_dist <= corner_r)
    
    if not is_in_box:
        return (0, 0, 0, 0) # transparent
        
    # Emerald gradient
    grad = y / h
    r_bg = int(22 * (1 - grad) + 4 * grad)
    g_bg = int(163 * (1 - grad) + 120 * grad)
    b_bg = int(74 * (1 - grad) + 87 * grad)
    
    # White school roof triangle in the center
    # Roof apex at (cx, cy - h*0.22)
    # Roof base at cy - h*0.05
    roof_top_y = cy - h * 0.22
    roof_base_y = cy - h * 0.05
    roof_half_w = w * 0.28
    
    if roof_top_y <= y <= roof_base_y:
        ratio = (y - roof_top_y) / (roof_base_y - roof_top_y)
        if abs(dx) <= ratio * roof_half_w:
            return (255, 255, 255, 255)
            
    # School building base (pillar / door)
    if roof_base_y < y <= cy + h * 0.22:
        if abs(dx) <= w * 0.25:
            # Door opening in center
            if abs(dx) <= w * 0.07 and y >= cy + h * 0.06:
                return (r_bg, g_bg, b_bg, 255) # door cutout
            # Pillars cutout
            if (abs(abs(dx) - w * 0.14) <= w * 0.02) and (cy - h * 0.02 <= y <= cy + h * 0.18):
                return (r_bg, g_bg, b_bg, 255) # pillar cutout
            return (255, 255, 255, 255)
            
    # Foundation base line
    if cy + h * 0.22 < y <= cy + h * 0.26 and abs(dx) <= w * 0.30:
        return (255, 255, 255, 255)
        
    return (r_bg, g_bg, b_bg, 255)

os.makedirs('public', exist_ok=True)

print("Generating 192x192 PWA Icon...")
png_192 = make_png(192, 192, icon_color)
with open('public/pwa-192x192.png', 'wb') as f:
    f.write(png_192)

print("Generating 512x512 PWA Icon...")
png_512 = make_png(512, 512, icon_color)
with open('public/pwa-512x512.png', 'wb') as f:
    f.write(png_512)

with open('public/apple-touch-icon.png', 'wb') as f:
    f.write(png_192)

print("PWA icons successfully created in public/!")
