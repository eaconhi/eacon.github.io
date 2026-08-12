#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DOCX_PATH="${1:-$ROOT_DIR/江奕坤EaconJing_官网简历面试解释手册.docx}"
OUTPUT_DIR="${2:-$ROOT_DIR/tmp/docx-qa-final}"
LO_FONT_DIR="/Users/shuotujiaoyu/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype"
RENDERER="/Users/shuotujiaoyu/.codex/plugins/cache/openai-primary-runtime/documents/26.805.11740/skills/documents/render_docx.py"
PYTHON="/Users/shuotujiaoyu/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3"

font_links=(
  "$LO_FONT_DIR/NotoSansCJKsc-Regular.otf"
  "$LO_FONT_DIR/NotoSansCJKsc-Bold.otf"
)

cleanup() {
  for link in "${font_links[@]}"; do
    if [[ -L "$link" ]]; then
      unlink "$link"
    fi
  done
}
trap cleanup EXIT

ln -s /Library/Fonts/NotoSansCJKsc-Regular.otf "${font_links[0]}"
ln -s /Library/Fonts/NotoSansCJKsc-Bold.otf "${font_links[1]}"

mkdir -p "$OUTPUT_DIR"
"$PYTHON" "$RENDERER" "$DOCX_PATH" --output_dir "$OUTPUT_DIR" --emit_pdf
