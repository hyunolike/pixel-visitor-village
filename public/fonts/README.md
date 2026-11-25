# Website fonts

These are original, unmodified fonts used by the website only. The font files live in `src/assets/fonts/` and Vite publishes them as hashed assets. The full copyright notices and SIL Open Font License 1.1 texts are served alongside this file.

| Typeface | Version / author | Original source | License |
| --- | --- | --- | --- |
| NeoDunggeunmo / Neo둥근모 | v1.600 / Eunbin Jeong (Dalgona.) | https://github.com/neodgm/neodgm/releases/download/v1.600/neodgm.woff2 | [neodgm-OFL.txt](neodgm-OFL.txt) |
| Pretendard Variable | v1.3.9 / Kil Hyung-jin and contributors | https://raw.githubusercontent.com/orioncactus/pretendard/v1.3.9/packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2 | [pretendard-OFL.txt](pretendard-OFL.txt) |

Usage: Korean/English brand and short display copy use NeoDunggeunmo at 16px multiples without synthetic bold or italics, following https://neodgm.dalgona.dev/guides.html. Reading and controls use Pretendard. Japanese/Chinese use locale-specific system stacks. Loading uses `font-display: swap` and readable fallbacks. The independent embedded widget does not load these fonts.
