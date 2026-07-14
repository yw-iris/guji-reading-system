#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""批量生成诗词逐句「真实 AI 国风插画」，并自动改写插画清单指向 .png。
前置条件：设置环境变量 GEMINI_API_KEY（真实 Gemini 图像密钥）。
用法：
    export GEMINI_API_KEY="你的key"
    python3 scripts/gen_poem_art_ai.py            # 生成全部 35 张（1K）
    python3 scripts/gen_poem_art_ai.py --resolution 2K   # 更高清
    python3 scripts/gen_poem_art_ai.py --force    # 覆盖已存在的 png
生成完成后运行  npm run build  即可上线真实 AI 图（组件代码无需改动）。
"""
import os
import subprocess
import argparse

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ART_DIR = os.path.join(ROOT, "public", "poem-art")
MANIFEST = os.path.join(ROOT, "src", "data", "poemLineArt.ts")
NANO_SCRIPT = ("/root/.codebuddy/plugins/marketplaces/codebuddy-plugins-official/"
               "plugins/hot-skills/skills/nano-banana-pro/scripts/generate_image.py")

# 与 gen_poem_art.py 保持一致；每句以 。！？； 结尾
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

STYLE_PREFIX = (
    "Traditional Chinese children's storybook illustration, gentle ink-wash and mineral-pigment "
    "(gongbi) guofeng style, warm rice-paper beige background, soft vermilion, gold and jade-green "
    "accents, cute and calming, decorative border with a small red seal stamp, NO words or letters. "
    "Scene: "
)
STYLE_SUFFIX = ". Vertical composition, child-friendly, soft lighting."


def scene_cn(line):
    parts = []
    has = lambda *ks: any(k in line for k in ks)
    if has("月", "明月"):
        parts.append("一轮明月挂在夜空")
    if has("日", "阳", "照"):
        parts.append("温暖的太阳")
    if has("雲", "云", "煙", "烟", "霧", "雾"):
        parts.append("淡淡云雾")
    if has("山"):
        parts.append("远山叠嶂")
    if has("水", "江", "河", "流", "泉", "溪", "池", "塘", "湖", "波", "川"):
        parts.append("清澈流水")
    if has("鳥", "鸟"):
        parts.append("飞翔的小鸟")
    if has("花", "蓮", "莲", "荷"):
        parts.append("绽放的荷花与花朵")
    if has("柳"):
        parts.append("垂柳依依")
    if has("舟", "船", "艇", "帆"):
        parts.append("江上的小舟")
    if has("兒", "儿", "童", "娃", "小娃", "子"):
        parts.append("活泼的小孩")
    if has("風", "风"):
        parts.append("轻柔春风")
    if has("草", "莺", "鶯"):
        parts.append("青青草地与黄莺")
    if has("樹", "木", "楊", "杨", "林"):
        parts.append("绿树")
    if has("故鄉", "乡", "村", "居"):
        parts.append("乡村小屋")
    if has("霜"):
        parts.append("地上白霜")
    if not parts:
        parts.append("宁静的田园景色")
    return "，".join(parts)


def write_manifest(entries):
    lines = [
        "// 诗词逐句插画清单：键为 `${textId}-${idx}`，值为相对 BASE_URL 的文件路径。",
        "// 由 scripts/gen_poem_art_ai.py 生成（真实 AI 图指向 .png；占位 SVG 指向 .svg）。",
        "// 组件代码无需改动，npm run build 即生效。",
        "export const poemLineArt: Record<string, string> = {",
    ]
    for key in sorted(entries):
        lines.append(f"  '{key}': 'poem-art/{entries[key]}',")
    lines.append("};")
    lines.append("")
    with open(MANIFEST, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--resolution", default="1K", choices=["1K", "2K", "4K"])
    ap.add_argument("--api-key", default=None)
    ap.add_argument("--force", action="store_true", help="覆盖已存在的 png")
    args = ap.parse_args()

    key = args.api_key or os.environ.get("GEMINI_API_KEY")
    if not key:
        print("✗ 未找到 GEMINI_API_KEY。请先设置：export GEMINI_API_KEY=\"你的key\"")
        return
    if not os.path.exists(NANO_SCRIPT):
        print(f"✗ 找不到 nano-banana-pro 脚本：{NANO_SCRIPT}")
        return

    os.makedirs(ART_DIR, exist_ok=True)

    # 先读现有清单（保留未成功生成的 .svg 占位）
    existing = {}
    if os.path.exists(MANIFEST):
        import re
        txt = open(MANIFEST, encoding="utf-8").read()
        for m in re.finditer(r"'(text-\d+-\d+)':\s*'poem-art/([^']+)'", txt):
            existing[m.group(1)] = m.group(2)

    ok = 0
    total = sum(len(v) for v in POEMS.values())
    done = 0
    for text_id, lines in POEMS.items():
        for i, line in enumerate(lines):
            done += 1
            key_name = f"{text_id}-{i}"
            png_path = os.path.join(ART_DIR, f"{key_name}.png")
            if os.path.exists(png_path) and not args.force:
                print(f"[{done}/{total}] 跳过已存在 {key_name}.png")
                existing[key_name] = f"{key_name}.png"
                ok += 1
                continue
            prompt = STYLE_PREFIX + scene_cn(line) + STYLE_SUFFIX
            print(f"[{done}/{total}] 生成 {key_name} ...")
            try:
                r = subprocess.run(
                    ["uv", "run", NANO_SCRIPT, "--prompt", prompt,
                     "--filename", png_path, "--resolution", args.resolution],
                    env={**os.environ, "GEMINI_API_KEY": key},
                    capture_output=True, text=True, timeout=180,
                )
                if r.returncode == 0 and os.path.exists(png_path):
                    existing[key_name] = f"{key_name}.png"
                    ok += 1
                else:
                    print(f"  ! 生成失败，保留 .svg 占位。stderr: {r.stderr[:200]}")
            except Exception as e:  # noqa
                print(f"  ! 异常：{e}")

    write_manifest(existing)
    print(f"\n✓ 完成：{ok}/{total} 张成功，清单已更新 -> {MANIFEST}")
    print("下一步：npm run build  &&  部署 gh-pages")


if __name__ == "__main__":
    main()
