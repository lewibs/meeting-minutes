import { Plugin } from "obsidian";

export interface WhisperSettings {
	//TODO maybe keep this if they can use any api
	apiKey: string;
	//TODO modify to allow the user to use any api?
	apiUrl: string;
	//TODO remove model
	model: string;
	//TODO remove prompt
	prompt: string;
	//TODO remove language
	language: string;

	saveAudioFile: boolean;
	saveAudioFilePath: string;
	
	//TODO remove debug mode
	debugMode: boolean;
	createNewFileAfterRecording: boolean;
	createNewFileAfterRecordingPath: string;
}

export const DEFAULT_SETTINGS: WhisperSettings = {
	apiKey: "",
	apiUrl: "https://api.openai.com/v1/audio/transcriptions",
	model: "whisper-1",
	prompt: "",
	language: "en",
	saveAudioFile: true,
	saveAudioFilePath: "",
	debugMode: false,
	createNewFileAfterRecording: true,
	createNewFileAfterRecordingPath: "",
};

export class SettingsManager {
	private plugin: Plugin;

	constructor(plugin: Plugin) {
		this.plugin = plugin;
	}

	async loadSettings(): Promise<WhisperSettings> {
		return Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.plugin.loadData()
		);
	}

	async saveSettings(settings: WhisperSettings): Promise<void> {
		await this.plugin.saveData(settings);
	}
}