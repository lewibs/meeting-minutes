import axios from "axios";
import Whisper from "main";
import { Notice, MarkdownView } from "obsidian";
import { getBaseFileName } from "./utils";

export class AudioHandler {
	private plugin: Whisper;

	constructor(plugin: Whisper) {
		this.plugin = plugin;
	}

	async sendAudioData(blob: Blob, fileName: string): Promise<void> {
		// Get the base file name without extension
		const baseFileName = getBaseFileName(fileName);

		const audioFilePath = `${
			this.plugin.settings.saveAudioFilePath
				? `${this.plugin.settings.saveAudioFilePath}/`
				: ""
		}${fileName}`;

		const noteFilePath = `${
			this.plugin.settings.createNewFileAfterRecordingPath
				? `${this.plugin.settings.createNewFileAfterRecordingPath}/`
				: ""
		}${baseFileName}.md`;

		if (this.plugin.settings.debugMode) {
			new Notice(`Sending audio data size: ${blob.size / 1000} KB`);
		}

		const formData = new FormData();
		formData.append("file", blob, fileName);
		formData.append("model", this.plugin.settings.model);
		formData.append("language", this.plugin.settings.language);
		if (this.plugin.settings.prompt)
			formData.append("prompt", this.plugin.settings.prompt);

		try {
			// If the saveAudioFile setting is true, save the audio file
			if (this.plugin.settings.saveAudioFile) {
				const arrayBuffer = await blob.arrayBuffer();
				await this.plugin.app.vault.adapter.writeBinary(
					audioFilePath,
					new Uint8Array(arrayBuffer)
				);
				new Notice("Audio saved successfully.");
			}
		} catch (err) {
			console.error("Error saving audio file:", err);
			new Notice("Error saving audio file: " + err.message);
		}

		try {
			if (this.plugin.settings.debugMode) {
				new Notice("Parsing audio data:" + fileName);
			}

            //TODO connect to some api to convert audio to text
            console.log(formData)

            const audio_response = {
                data:{
                    text:"this is the transcription"
                }
            }
            
            //TODO connect to some api to convert raw text to a summary

            const summary_response = {
                data:{
                    text:"this is a summary"
                }
            }

			// Determine if a new file should be created
			// const activeView = this.plugin.app.workspace.getActiveViewOfType(MarkdownView);
			// const shouldCreateNewFile = this.plugin.settings.createNewFileAfterRecording || !activeView;

			//TODO give this a quick toggle when the menu is activated
            const writeToCursor = false;
            
            if (writeToCursor) {
                const editor = this.plugin.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
    
                if (editor) {
                    const cursorPosition = editor.getCursor();
                    editor.replaceRange(summary_response.data.text, cursorPosition);
            
                    // Move the cursor to the end of the inserted text
                    const newPosition = {
                        line: cursorPosition.line,
                        ch: cursorPosition.ch + summary_response.data.text.length,
                    };
                    editor.setCursor(newPosition);
                }
            } else {
                await this.plugin.app.vault.create(
					noteFilePath,
					`![[${audioFilePath}]]\n# Meeting Minutes:\n${summary_response.data.text}\n# Transcription\n${audio_response.data.text}`
				);
				await this.plugin.app.workspace.openLinkText(
					noteFilePath,
					"",
					true
				); 
            }

			new Notice("Audio parsed successfully.");
		} catch (err) {
			console.error("Error parsing audio:", err);
			new Notice("Error parsing audio: " + err.message);
		}
	}
}