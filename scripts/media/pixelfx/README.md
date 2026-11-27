# Village pixel effects

Authored with the installed pixelfx skill and upstream Node tools, pinned to patch-gg/pixelfx5294518ce7c72e48b6100a744596e0acf57f2826. The five JavaScript modules are copied to the checkout's src/fx/village by the export command. Their imports resolve there; they are not browser runtime modules. No upstream source or font is vendored into the app.

Existing library candidates inspected: fire/torch, weather/falling-leaves, weather/fireflies, pickups/collect-burst. Full-field candidates add haze/ground and are too dense for the article widget. These small motifs retain the turning, palette/light and glint techniques and use the village colors. MIT notices are in public/licenses/pixelfx.txt and prepended to the standalone bundle by its final build hook.

Reproduce with a checkout at the pinned commit:

```sh
node scripts/media/export-pixelfx.mjs /path/to/pixelfx final
cd /path/to/pixelfx
node tools/check.mjs village
```

The exporter checks HEAD, copies the source modules, uses the upstream renderer/compositor/PNG writer, writes transparent frames to one atlas with metadata, and rejects PNG>64KB or decoded texture>2MB. The runtime uses nearest filtering and owns a disposable copy per renderer. Only the generated PNG/JSON reach the widget.

Three visual passes are recorded under docs/assets/pixelfx/{round1,round2,final}. Round2 softens petal highlights, adds leaf edge detail/stem and staggers glints. Final turns the leaf silhouette and subdues the snow core. Final atlas SHA256 c418b516e23110286f035a9d25a68bbba574f6f83bb05d881e8e5b2ac9204421 repeats after formatting/re-export. Upstream check5/5 passes without warnings.
