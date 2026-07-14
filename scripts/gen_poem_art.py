#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成诗词逐句「国风童趣」插画（SVG）。
每行一句，按关键词绘制国风意象。无外部依赖，确定性输出。
输出到 public/poem-art/{textId}-{idx}.svg
"""
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "poem-art")
os.makedirs(OUT, exist_ok=True)

# 诗词逐句（与 splitIntoSentences 顺序一致：每句以 。！？； 结尾）
POEMS = {
    "text-001": ["床前明月光，", "疑是地上霜。", "举头望明月，", "低头思故乡。"],
    "text-002": ["人之初，性本善。", "性相近，习相远。", "苟不教，性乃迁。"],
    "text-004": ["半亩方塘一鉴开，", "天光云影共徘徊。", "问渠那得清如许？", "为有源头活水来。"],
    "text-006": ["日照香炉生紫烟，", "遥看瀑布挂前川。", "飞流直下三千尺，", "疑是银河落九天。"],
    "text-025": ["春眠不觉晓，", "处处闻啼鸟。", "夜来风雨声，", "花落知多少。"],
    "text-026": ["碧玉妆成一树高，", "万条垂下绿丝绦。", "不知细叶谁裁出，", "二月春风似剪刀。"],
    "text-027": ["小娃撑小艇，", "偷采白莲回。", "不解藏踪迹，", "浮萍一道开。"],
    "text-028": ["泉眼无声惜细流，", "树阴照水爱晴柔。", "小荷才露尖尖角，", "早有蜻蜓立上头。"],
    "text-029": ["草长莺飞二月天，", "拂堤杨柳醉春烟。", "儿童散学归来早，", "忙趁东风放纸鸢。"],
}

PARCH_1, PARCH_2 = "#fbf4e4", "#f1e2c5"
INK, GOLD, VERM, JADE, BLUE = "#2c1810", "#b8860b", "#c43a31", "#5b8c5a", "#2e5984"

W, H = 400, 300


def rand(seed):
    s = seed

    def f():
        nonlocal s
        s = (s * 1103515245 + 12345) & 0x7FFFFFFF
        return s / 0x7FFFFFFF
    return f


def moon():
    return (f'<circle cx="312" cy="74" r="34" fill="#f6e7b8"/>'
            f'<circle cx="312" cy="74" r="34" fill="none" stroke="{GOLD}" stroke-width="1.5" opacity="0.6"/>'
            f'<circle cx="304" cy="68" r="6" fill="#e9d39a" opacity="0.8"/>'
            f'<circle cx="322" cy="82" r="4" fill="#e9d39a" opacity="0.7"/>'
            f'<circle cx="318" cy="64" r="3" fill="#e9d39a" opacity="0.7"/>')


def sun():
    rays = "".join(
        f'<line x1="312" y1="40" x2="312" y2="22" stroke="{GOLD}" stroke-width="3" stroke-linecap="round" transform="rotate({a} 312 74)"/>'
        for a in range(0, 360, 45))
    return (f'{rays}<circle cx="312" cy="74" r="28" fill="#f3cf6b"/>'
            f'<circle cx="312" cy="74" r="28" fill="none" stroke="{GOLD}" stroke-width="1.5" opacity="0.6"/>')


def cloud(x, y, s=1.0, col="#ffffff"):
    return (f'<g opacity="0.92" fill="{col}">'
            f'<ellipse cx="{x}" cy="{y}" rx="{34*s}" ry="{16*s}"/>'
            f'<ellipse cx="{x-26*s}" cy="{y+6*s}" rx="{22*s}" ry="{12*s}"/>'
            f'<ellipse cx="{x+26*s}" cy="{y+6*s}" rx="{24*s}" ry="{13*s}"/>'
            f'</g>')


def mountains():
    return (f'<path d="M0,250 L70,180 L130,235 L200,160 L270,235 L340,185 L400,250 Z" '
            f'fill="#cdbf9a" opacity="0.55"/>'
            f'<path d="M0,250 L90,205 L160,245 L250,195 L330,248 L400,215 L400,250 Z" '
            f'fill="#a8946b" opacity="0.5"/>')


def water():
    return (f'<path d="M0,262 q40,-14 80,0 t80,0 t80,0 t80,0 t80,0" fill="none" '
            f'stroke="{BLUE}" stroke-width="2.5" opacity="0.55"/>'
            f'<path d="M0,275 q40,-12 80,0 t80,0 t80,0 t80,0 t80,0" fill="none" '
            f'stroke="{BLUE}" stroke-width="2" opacity="0.4"/>')


def bird(x, y):
    return (f'<path d="M{x-14},{y} q7,-9 14,0 q7,-9 14,0" fill="none" stroke="{INK}" '
            f'stroke-width="2.4" stroke-linecap="round"/>')


def flower(x, y, col=VERM):
    petals = "".join(
        f'<circle cx="{x+18*__import__("math").cos(i*1.2566)}" cy="{y+18*__import__("math").sin(i*1.2566)}" r="9" fill="{col}" opacity="0.9"/>'
        for i in range(5))
    return f'{petals}<circle cx="{x}" cy="{y}" r="7" fill="#f6d36b"/>'


def willow():
    s = ""
    for i, dx in enumerate([-40, -10, 20, 50]):
        sx = 200 + dx
        s += f'<path d="M{sx},120 q4,40 -2,80" fill="none" stroke="{JADE}" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>'
        s += f'<path d="M{sx-4},130 q-10,30 -6,60" fill="none" stroke="{JADE}" stroke-width="1.6" opacity="0.7"/>'
    return (f'<path d="M180,118 q20,-26 40,0" fill="none" stroke="#7a5a32" stroke-width="5" stroke-linecap="round"/>{s}')


def boat():
    return (f'<path d="M150,218 q50,26 100,0 Z" fill="#9c6b3f"/>'
            f'<rect x="196" y="150" width="4" height="64" fill="#7a5a32"/>'
            f'<path d="M200,152 L200,210 L246,210 Z" fill="#f3e6c8" stroke="{GOLD}" stroke-width="1.5"/>')


def lotus(x, y):
    return (f'<path d="M{x},{y} q12,-30 24,0 q12,-30 24,0 q12,-30 24,0 Z" fill="#e79bb0" opacity="0.9"/>'
            f'<ellipse cx="{x+24}" cy="{y+2}" rx="10" ry="16" fill="#f2b8c6"/>')


def child(x, y):
    return (f'<circle cx="{x}" cy="{y-22}" r="13" fill="#f0c9a0"/>'
            f'<path d="M{x-15},{y+22} q15,-44 30,0 Z" fill="{VERM}" opacity="0.9"/>')


def wind():
    return (f'<path d="M120,90 q30,-12 60,0" fill="none" stroke="{JADE}" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>'
            f'<path d="M140,108 q30,-12 60,0" fill="none" stroke="{JADE}" stroke-width="2.2" stroke-linecap="round" opacity="0.6"/>')


def grass():
    s = ""
    for i in range(7):
        gx = 40 + i * 46
        s += f'<path d="M{gx},258 q4,-22 0,-34" fill="none" stroke="{JADE}" stroke-width="2.4" stroke-linecap="round" opacity="0.8"/>'
    return s


def tree(x, y):
    return (f'<rect x="{x-4}" y="{y-10}" width="8" height="40" fill="#7a5a32"/>'
            f'<circle cx="{x}" cy="{y-26}" r="26" fill="{JADE}" opacity="0.85"/>'
            f'<circle cx="{x-16}" cy="{y-14}" r="16" fill="{JADE}" opacity="0.7"/>'
            f'<circle cx="{x+16}" cy="{y-14}" r="16" fill="{JADE}" opacity="0.7"/>')


def house():
    return (f'<rect x="176" y="196" width="48" height="40" fill="#e9d3a8" stroke="#9c6b3f" stroke-width="2"/>'
            f'<path d="M170,196 L200,168 L230,196 Z" fill="#c43a31" opacity="0.85"/>'
            f'<rect x="194" y="212" width="14" height="24" fill="#9c6b3f"/>')


def frost():
    s = ""
    for i in range(6):
        fx = 30 + i * 64
        s += f'<path d="M{fx},244 l6,6 l-6,6 l-6,-6 Z" fill="#ffffff" opacity="0.85"/>'
    return s


def detect_motifs(line):
    l = line
    motifs = []
    has = lambda *ks: any(k in l for k in ks)
    if has("月", "明月"):
        motifs.append("moon")
    elif has("日", "阳", "照"):
        motifs.append("sun")
    if has("雲", "云", "烟", "煙", "霧", "雾"):
        motifs.append("cloud")
    if has("山"):
        motifs.append("mountain")
    if has("水", "江", "河", "流", "泉", "溪", "池", "塘", "湖", "波", "川"):
        motifs.append("water")
    if has("鳥", "鸟"):
        motifs.append("bird")
    if has("花", "蓮", "莲", "荷"):
        motifs.append("flower")
    if has("柳"):
        motifs.append("willow")
    if has("舟", "船", "艇", "帆"):
        motifs.append("boat")
    if has("兒", "儿", "童", "娃", "小娃", "子"):
        motifs.append("child")
    if has("風", "风"):
        motifs.append("wind")
    if has("草", "莺", "鶯"):
        motifs.append("grass")
    if has("樹", "木", "楊", "杨", "林"):
        motifs.append("tree")
    if has("故鄉", "乡", "村", "居"):
        motifs.append("house")
    if has("霜"):
        motifs.append("frost")
    return motifs


def build_svg(text_id, idx, line):
    caption = line.rstrip("，。！？；,.")
    motifs = detect_motifs(line)
    # 背景图层
    body = []
    body.append(f'<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">'
                f'<stop offset="0%" stop-color="{PARCH_1}"/>'
                f'<stop offset="100%" stop-color="{PARCH_2}"/></linearGradient></defs>')
    body.append(f'<rect width="{W}" height="{H}" rx="14" fill="url(#bg)"/>')
    # 远景：山 + 水（默认氛围）
    body.append(mountains())
    body.append(water())
    # 关键词意象（最多取 4 个，去重顺序）
    drawn = []
    for m in motifs:
        if m in drawn:
            continue
        drawn.append(m)
        if m == "moon":
            body.append(moon())
        elif m == "sun":
            body.append(sun())
        elif m == "cloud":
            body.append(cloud(120, 70, 1.0))
            body.append(cloud(250, 96, 0.8))
        elif m == "mountain":
            pass  # 已默认
        elif m == "water":
            pass
        elif m == "bird":
            body.append(bird(150, 84))
            body.append(bird(210, 70))
        elif m == "flower":
            body.append(flower(120, 150))
            body.append(flower(280, 160, VERM))
        elif m == "willow":
            body.append(willow())
        elif m == "boat":
            body.append(boat())
        elif m == "child":
            body.append(child(150, 200))
        elif m == "wind":
            body.append(wind())
        elif m == "grass":
            body.append(grass())
        elif m == "tree":
            body.append(tree(310, 200))
        elif m == "house":
            body.append(house())
        elif m == "frost":
            body.append(frost())
        if len(drawn) >= 4:
            break
    # 国风边框
    body.append(f'<rect x="6" y="6" width="{W-12}" height="{H-12}" rx="10" fill="none" '
                f'stroke="{GOLD}" stroke-width="2" opacity="0.7"/>')
    body.append(f'<rect x="11" y="11" width="{W-22}" height="{H-22}" rx="7" fill="none" '
                f'stroke="{INK}" stroke-width="0.8" opacity="0.35"/>')
    # 印章
    body.append(f'<rect x="{W-46}" y="16" width="30" height="30" rx="3" fill="{VERM}" opacity="0.9"/>')
    body.append(f'<text x="{W-31}" y="37" font-size="17" fill="#fff" text-anchor="middle" '
                f'font-family="serif">{caption[0]}</text>')
    # 底部题句缎带
    body.append(f'<rect x="0" y="262" width="{W}" height="38" fill="{INK}" opacity="0.82"/>')
    body.append(f'<text x="{W/2}" y="287" font-size="19" fill="#f5e6d3" text-anchor="middle" '
                f'font-family="\'Noto Serif SC\', serif" letter-spacing="2">{caption}</text>')
    svg = (f'<?xml version="1.0" encoding="UTF-8"?>\n'
           f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
           f'viewBox="0 0 {W} {H}">{"".join(body)}</svg>\n')
    return svg


def main():
    count = 0
    for text_id, lines in POEMS.items():
        for i, line in enumerate(lines):
            svg = build_svg(text_id, i, line)
            fn = os.path.join(OUT, f"{text_id}-{i}.svg")
            with open(fn, "w", encoding="utf-8") as f:
                f.write(svg)
            count += 1
    print(f"generated {count} svg files in {os.path.abspath(OUT)}")


if __name__ == "__main__":
    main()
