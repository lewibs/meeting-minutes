import Plugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { SettingsManager } from "./SettingsManager";

export class SettingsTab extends PluginSettingTab {
	private plugin: Plugin;
	private settingsManager: SettingsManager;
	private createNewFileInput: Setting;
	private saveAudioFileInput: Setting;

	constructor(app: App, plugin: Plugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.settingsManager = plugin.settingsManager;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		this.createHeader();
		this.createSaveAudioFileToggleSetting();
		this.createSaveAudioFilePathSetting();
		this.transcriptPathSetting();
		this.linkToToggleSetting();
	}

	private createHeader(): void {
		this.containerEl.createEl("h2", { text: "Settings for Plugin." });
	}

	private createSaveAudioFileToggleSetting(): void {
		new Setting(this.containerEl)
			.setName("Save recording")
			.setDesc(
				"Turn on to save the audio file"
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.saveAudioFile)
					.onChange(async (value) => {
						this.plugin.settings.saveAudioFile = value;
						if (!value) {
							this.plugin.settings.saveAudioFilePath = "";
						}
						await this.settingsManager.saveSettings(
							this.plugin.settings
						);
						this.saveAudioFileInput.setDisabled(!value);
					})
			);
	}

	private createSaveAudioFilePathSetting(): void {
		this.saveAudioFileInput = new Setting(this.containerEl)
			.setName("Recordings folder")
			.setDesc(
				"Specify the path in the vault where to save the audio files"
			)
			.addText((text) =>
				text
					.setPlaceholder("Example: folder/audio")
					.setValue(this.plugin.settings.saveAudioFilePath)
					.onChange(async (value) => {
						this.plugin.settings.saveAudioFilePath = value;
						await this.settingsManager.saveSettings(
							this.plugin.settings
						);
					})
			)
			.setDisabled(!this.plugin.settings.saveAudioFile);
	}

	private transcriptPathSetting(): void {
		this.createNewFileInput = new Setting(this.containerEl)
			.setName("Transcriptions folder")
			.setDesc(
				"Specify the path in the vault where to save the transcription files"
			)
			.addText((text) => {
				text.setPlaceholder("Example: folder/note")
					.setValue(
						this.plugin.settings.transcriptPath
					)
					.onChange(async (value) => {
						this.plugin.settings.transcriptPath =
							value;
						await this.settingsManager.saveSettings(
							this.plugin.settings
						);
					});
			});
	}

	private linkToToggleSetting(): void {
		new Setting(this.containerEl)
			.setName("Link toggle")
			.setDesc(
				"Turn on to create a link to the summary at your cursor"
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.linkAtCursor)
					.onChange(async (value) => {
						this.plugin.settings.linkAtCursor = value;
						await this.settingsManager.saveSettings(
							this.plugin.settings
						);
					});
			});
	}
}