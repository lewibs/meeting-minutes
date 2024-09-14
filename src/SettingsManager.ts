import { Plugin } from "obsidian";

export interface Settings {
	saveAudioFile: boolean;
	saveAudioFilePath: string;
	transcriptPath: string;
	linkAtCursor: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
	saveAudioFile: true,
	saveAudioFilePath: "",
	transcriptPath: "",
	linkAtCursor: false,
};

export class SettingsManager {
	private plugin: Plugin;

	constructor(plugin: Plugin) {
		this.plugin = plugin;
	}

	async loadSettings(): Promise<Settings> {
		return Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.plugin.loadData()
		);
	}

	async saveSettings(settings: Settings): Promise<void> {
		await this.plugin.saveData(settings);
	}
}