# Tab Bar Icons Placeholder

Since Taro requires actual image files for tab bar icons, you'll need to add icon files to the `src/assets/images/` directory.

For now, the project will use these placeholder paths in app.config.ts:
- `assets/images/tab-home.png` (40x40px)
- `assets/images/tab-home-active.png` (40x40px)
- `assets/images/tab-stats.png` (40x40px)
- `assets/images/tab-stats-active.png` (40x40px)
- `assets/images/tab-settings.png` (40x40px)
- `assets/images/tab-settings-active.png` (40x40px)

You can create simple icon images or use icon fonts as base64 data URIs.

For testing without icons, you can temporarily comment out the `tabBar` section in `src/app.config.ts`.
