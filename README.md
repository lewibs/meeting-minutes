# Meeting-Audio-to-Meeting-Summary in Obsidian using free LLMs

Meeting minutes is a plugin that automatically turns your speech and computer audio into written notes. Just press record, and let this plugin take notes for you!

## 🚀 Getting Started

1. This plugin can be installed from "Community Plugins" inside Obsidian.

## 🎯 How to Use

### Access Recording Controls

Click on the tool button indicated by the sound wave to open the recording controls interface.

### Record Audio

Press "Start" to begin recording. You can pause or resume the recording using the "Pause/Resume" button. Click the "Stop" button once you're done. After stopping the recording, the plugin will automatically transcribe the audio and create a new note with the transcribed content and linked audio file in the specified folder.

## ⚙️ Settings

-   Save recording: Toggle this option to save the audio file after sending it to the Whisper API. When enabled, you can specify the path in the vault where the audio files should be saved.

-   Recordings folder: Specify the path in the vault where to save the audio files. Example: `folder/audio`. This option is only available if "Save recording" is enabled.

-   Transcriptions folder: Specify the path in the vault where to save the transcription files. Example: `folder/note`. This option is only available if "Save transcription" is enabled.

- Link toggle: When this is turned on, the link to the new meeting summary will be injected at your cursor. 

## 🤝 Contributing

Id love to have your help, hear your inputs or listen to your complaints. Make a note at the [Issues](https://github.com/lewibs/meeting-minutes/issues) to do so.

## ⚒️ Manual Installation

If you want to install this plugin manually, use the following steps:

1. Download `manifest.json`, `main.js`, `styles.css` from the [GitHub repository](https://github.com/lewibs/meeting-minutes/releases) into the `plugins/meeting-minutes` folder within your Obsidian vault.
2. Click on `Reload plugins` button inside `Settings > Community plugins`.
3. Locate the "Meeting Minutes" plugin and enable it.

## 🤩 Say Thank You

Follow me on [Github](https://github.com/lewibs) and check out my [Website](https://lewibs.com)

## Credits
This work is heavily influenced by the [Whisper](https://github.com/nikdanilov/whisper-obsidian-plugin) by [@nikdanilov\_](https://twitter.com/nikdanilov_). However, I wanted a free version that was specially designed for handling meeting audio.
---
