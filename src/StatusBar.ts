import { Plugin } from "obsidian";

export enum RecordingStatus {
	Idle = "idle",
	Recording = "recording",
	Processing = "processing",
}

export class StatusBar {
	plugin: Plugin;
	statusBarItem: HTMLElement | null = null;
	status: RecordingStatus = RecordingStatus.Idle;

	constructor(plugin: Plugin) {
		this.plugin = plugin;
		this.statusBarItem = this.plugin.addStatusBarItem();
		this.updateStatusBarItem();
	}

	updateStatus(status: RecordingStatus) {
		this.status = status;
		this.updateStatusBarItem();
	}

	updateStatusBarItem() {
		if (this.statusBarItem) {
			switch (this.status) {
				case RecordingStatus.Recording:
					this.statusBarItem.textContent = "Recording...";
					this.statusBarItem.className = "stop";
					break;
				case RecordingStatus.Processing:
					this.statusBarItem.textContent = "Processing audio...";
					this.statusBarItem.className = "pause";
					break;
				case RecordingStatus.Idle:
				default:
					this.statusBarItem.textContent = "Audio Idle";
					this.statusBarItem.className = "play";
					break;
			}
		}
	}

	remove() {
		if (this.statusBarItem) {
			this.statusBarItem.remove();
		}
	}
}