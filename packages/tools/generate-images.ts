import * as fs from 'fs-extra';
import { dirname } from 'path';
import { execCommand } from './tool-utils';
import { fileExtension } from '@joplin/lib/path-utils';
const sharp = require('sharp');

interface Source {
	id: number;
	name: string;
}

interface Operation {
	source: number;
	dest: string;
	width?: number;
	height?: number;
	iconWidth?: number;
	iconHeight?: number;
}

const sources: Source[] = [
	{
		id: 1,
		name: 'Square_1024x1024.png',
	},
	{
		id: 2,
		name: 'RoundedCorners_16x16.png',
	},
	{
		id: 3,
		name: 'RoundedCorners_64x64.png',
	},
	{
		id: 4,
		name: 'RoundedCorners_1024x1024.png',
	},
	{
		id: 5,
		name: 'Joplin.ico',
	},
	{
		id: 6,
		name: '../JoplinLetter.png',
	},
	{
		id: 7,
		name: 'RoundedCornersMac_1024x1024.png',
	},
	{
		id: 8,
		name: 'WebsiteTopImage.png',
	},
	{
		id: 9,
		name: 'WebsiteTopImageCn.png',
	},
];

function sourceById(id: number) {
	for (const s of sources) {
		if (s.id === id) return s;
	}
	throw new Error(`Invalid source ID: ${id}`);
}

const operations: Operation[] = [

	// ============================================================================
	// iOS icons
	// ============================================================================

	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/ios_marketing1024x1024.png',
		width: 1024,
		height: 1024,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/ipad_app76x76.png',
		width: 76,
		height: 76,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/ipad_app76x76@2x.png',
		width: 152,
		height: 152,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/ipad_notification20x20.png',
		width: 20,
		height: 20,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/ipad_notification20x20@2x.png',
		width: 40,
		height: 40,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/ipad_pro_app83.5x83.5@2x.png',
		width: 167,
		height: 167,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/ipad_settings29x29.png',
		width: 29,
		height: 29,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/ipad_settings29x29@2x.png',
		width: 58,
		height: 58,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/ipad_spotlight40x40.png',
		width: 40,
		height: 40,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/ipad_spotlight40x40@2x.png',
		width: 80,
		height: 80,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/iphone_app60x60@2x.png',
		width: 120,
		height: 120,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/iphone_app60x60@3x.png',
		width: 180,
		height: 180,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/iphone_notification20x20@2x.png',
		width: 40,
		height: 40,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/iphone_notification20x20@3x.png',
		width: 60,
		height: 60,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/iphone_settings29x29@2x.png',
		width: 58,
		height: 58,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/iphone_settings29x29@3x.png',
		width: 87,
		height: 87,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/iphone_spotlight40x40@2x.png',
		width: 80,
		height: 80,
	},
	{
		source: 1,
		dest: 'packages/app-mobile/ios/Joplin/Images.xcassets/AppIcon.appiconset/iphone_spotlight40x40@3x.png',
		width: 120,
		height: 120,
	},

	// ============================================================================
	// macOS icons
	// ============================================================================

	{
		source: 2,
		dest: 'Assets/macOs.iconset/icon_16x16.png',
		width: 16,
		height: 16,
	},
	{
		source: 3,
		dest: 'Assets/macOs.iconset/icon_16x16@2x.png',
		width: 32,
		height: 32,
	},
	{
		source: 3,
		dest: 'Assets/macOs.iconset/icon_32x32.png',
		width: 32,
		height: 32,
	},
	{
		source: 3,
		dest: 'Assets/macOs.iconset/icon_32x32@2x.png',
		width: 64,
		height: 64,
	},
	{
		source: 7,
		dest: 'Assets/macOs.iconset/icon_128x128.png',
		width: 128,
		height: 128,
	},
	{
		source: 7,
		dest: 'Assets/macOs.iconset/icon_128x128@2x.png',
		width: 256,
		height: 256,
	},
	{
		source: 7,
		dest: 'Assets/macOs.iconset/icon_256x256.png',
		width: 256,
		height: 256,
	},
	{
		source: 7,
		dest: 'Assets/macOs.iconset/icon_256x256@2x.png',
		width: 512,
		height: 512,
	},
	{
		source: 7,
		dest: 'Assets/macOs.iconset/icon_512x512.png',
		width: 512,
		height: 512,
	},
	{
		source: 7,
		dest: 'Assets/macOs.iconset/icon_512x512@2x.png',
		width: 1024,
		height: 1024,
	},

	// ============================================================================
	// PortableApps launcher
	// ============================================================================

	{
		source: 5,
		dest: 'packages/tools/PortableAppsLauncher/App/AppInfo/appicon.ico',
	},
	{
		source: 2,
		dest: 'packages/tools/PortableAppsLauncher/App/AppInfo/appicon_16.png',
	},
	{
		source: 3,
		dest: 'packages/tools/PortableAppsLauncher/App/AppInfo/appicon_32.png',
		width: 32,
		height: 32,
	},
	{
		source: 4,
		dest: 'packages/tools/PortableAppsLauncher/App/AppInfo/appicon_75.png',
		width: 75,
		height: 75,
	},
	{
		source: 4,
		dest: 'packages/tools/PortableAppsLauncher/App/AppInfo/appicon_128.png',
		width: 128,
		height: 128,
	},
	{
		source: 4,
		dest: 'packages/tools/PortableAppsLauncher/App/AppInfo/Launcher/splash.jpg',
		width: 144,
		height: 144,
	},

	// ============================================================================
	// Windows tiles
	// ============================================================================

	{
		source: 6,
		dest: 'packages/app-desktop/build-win/icons/Square150x150Logo.png',
		width: 150,
		height: 150,
		iconWidth: 99,
		iconHeight: 75,
	},
	{
		source: 6,
		dest: 'packages/app-desktop/build-win/icons/SmallTile.png',
		width: 70,
		height: 70,
		iconWidth: 46,
		iconHeight: 46,
	},

	// ============================================================================
	// Website images
	// ============================================================================

	{
		source: 8,
		dest: 'Assets/WebsiteAssets/images/home-top-img-4x.webp',
		width: 4820,
		height: 2938,
	},
	{
		source: 8,
		dest: 'Assets/WebsiteAssets/images/home-top-img-2x.png',
		width: 2388,
		height: 1456,
	},
	{
		source: 8,
		dest: 'Assets/WebsiteAssets/images/home-top-img-2x.webp',
		width: 2388,
		height: 1456,
	},
	{
		source: 8,
		dest: 'Assets/WebsiteAssets/images/home-top-img.png',
		width: 1205,
		height: 734,
	},
	{
		source: 8,
		dest: 'Assets/WebsiteAssets/images/home-top-img.webp',
		width: 1205,
		height: 734,
	},

	// ============================================================================
	// Website images CN
	// ============================================================================

	{
		source: 9,
		dest: 'Assets/WebsiteAssets/images/home-top-img-cn-4x.webp',
		width: 4820,
		height: 2938,
	},
	{
		source: 9,
		dest: 'Assets/WebsiteAssets/images/home-top-img-cn-2x.png',
		width: 2388,
		height: 1456,
	},
	{
		source: 9,
		dest: 'Assets/WebsiteAssets/images/home-top-img-cn-2x.webp',
		width: 2388,
		height: 1456,
	},
	{
		source: 9,
		dest: 'Assets/WebsiteAssets/images/home-top-img-cn.png',
		width: 1205,
		height: 734,
	},
	{
		source: 9,
		dest: 'Assets/WebsiteAssets/images/home-top-img-cn.webp',
		width: 1205,
		height: 734,
	},
];

async function main() {
	const rootDir = dirname(dirname(__dirname));
	const sourceImageDir = `${rootDir}/Assets/ImageSources`;

	for (const operation of operations) {
		const source = sourceById(operation.source);

		const sourcePath = `${sourceImageDir}/${source.name}`;
		const destPath = `${rootDir}/${operation.dest}`;

		const sourceExt = fileExtension(sourcePath).toLowerCase();
		const destExt = fileExtension(destPath).toLowerCase();

		if ((operation.width && operation.height) || (sourceExt !== destExt)) {
			let s = sharp(sourcePath);

			if (operation.width && operation.height) {
				if (operation.iconWidth && operation.iconHeight) {
					s = s.resize(operation.iconWidth, operation.iconHeight, {
						fit: 'contain',
						background: { r: 0, g: 0, b: 0, alpha: 0 },
					}).extend({
						top: Math.floor((operation.height - operation.iconHeight) / 2),
						bottom: Math.ceil((operation.height - operation.iconHeight) / 2),
						left: Math.floor((operation.width - operation.iconWidth) / 2),
						right: Math.ceil((operation.width - operation.iconWidth) / 2),
						background: { r: 0, g: 0, b: 0, alpha: 0 },
					});
				} else {
					s = s.resize(operation.width, operation.height, { fit: 'fill' });
				}
			}

			if (destExt === 'jpg') {
				s.jpeg({ quality: 90 });
			} else if (destExt === 'png') {
				s.png({
					compressionLevel: 9,
				});
			} else if (destExt === 'webp') {
				s.webp({
					// quality: 90,
				});
			} else {
				throw new Error(`Unsupported extension: ${destExt}`);
			}

			s = s.toFile(destPath);
		} else {
			await fs.copyFile(sourcePath, destPath);
		}
	}

	if (process && process.platform === 'darwin') {
		const icnsDest = `${rootDir}/Assets/macOs.icns`;
		const icnsSource = `${rootDir}/Assets/macOs.iconset`;
		console.info(`iconutil -c icns -o "${icnsDest}" "${icnsSource}"`);
		await execCommand(`iconutil -c icns -o "${icnsDest}" "${icnsSource}"`);
	} else {
		console.info('If the macOS icon has been updated, this script should be run on macOS too');
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
