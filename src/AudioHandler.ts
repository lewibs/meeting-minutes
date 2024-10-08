import Plugin from "main";
import { Notice, MarkdownView } from "obsidian";
import { getBaseFileName } from "./utils";
import { Client } from "@gradio/client";

export class AudioHandler {
	private plugin: Plugin;

	constructor(plugin: Plugin) {
		this.plugin = plugin;
	}

	async sendAudioData(blob: Blob, fileName: string): Promise<void> {
		// Get the base file name without extension
		//TODO quick setting base file name.
		const baseFileName = getBaseFileName(fileName);

		const audioFilePath = `${
			this.plugin.settings.saveAudioFilePath
				? `${this.plugin.settings.saveAudioFilePath}/`
				: ""
		}${fileName}`;

		const noteFilePath = `${
			this.plugin.settings.transcriptPath
				? `${this.plugin.settings.transcriptPath}/`
				: ""
		}${baseFileName}.md`;

		const formData = new FormData();
		formData.append("file", blob, fileName);

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
			// const formData = new FormData();
			// formData.append("file", blob, fileName);
			console.log(audioFilePath)

            const client = await Client.connect("lewibs/summarize_audio");
			const result = await client.predict("/predict", { 
							audio_file: blob, 
			});

			const [summary, transcript] = result.data as string[]
			
			console.log(result)

			let audio_text = "";

			if (this.plugin.settings.saveAudioFile) {
				audio_text += `![[${audioFilePath}]]\n` 
			}

			audio_text += `# Meeting Minutes:\n${summary}\n# Transcription\n${transcript}` 

			await this.plugin.app.vault.create(
				noteFilePath,
				audio_text
			);
			
            if (this.plugin.settings.linkAtCursor) {
                const editor = this.plugin.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
    
                if (editor) {
                    const cursorPosition = editor.getCursor();
                    editor.replaceRange(`[[${baseFileName}]]`, cursorPosition);
            
                    // Move the cursor to the end of the inserted text
                    const newPosition = {
                        line: cursorPosition.line,
                        ch: cursorPosition.ch + baseFileName.length + 4, //4 for the link [[]]
                    };
                    editor.setCursor(newPosition);
                }
            } else {
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