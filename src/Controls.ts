import Plugin from "main";
import { ButtonComponent, Modal } from "obsidian";
import { RecordingStatus } from "./StatusBar";

export class Controls extends Modal {
	private plugin: Plugin;
	private startButton: ButtonComponent;
	private pauseButton: ButtonComponent;
	private stopButton: ButtonComponent;
	private timerDisplay: HTMLElement;

	constructor(plugin: Plugin) {
		super(plugin.app);
		this.plugin = plugin;
		this.containerEl.addClass("recording-controls");

		// Add elapsed time display
		this.timerDisplay = this.contentEl.createEl("div", { attr:{cls:"timer"} });
		this.updateTimerDisplay();

		// Set onUpdate callback for the timer
		this.plugin.timer.setOnUpdate(() => {
			this.updateTimerDisplay();
		});

		// Add button group
		const buttonGroupEl = this.contentEl.createEl("div", {attr: {cls: "button-group"}});
		
		//Add the start button
		this.startButton = new ButtonComponent(buttonGroupEl);
		this.startButton
			.setButtonText(" Record")
			.onClick(this.startRecording.bind(this))
			.buttonEl.addClass("start");
		this.startButton.setIcon("microphone"); // Ensure icon is set after styling
		
		// Add pause button
		this.pauseButton = new ButtonComponent(buttonGroupEl);
		this.pauseButton
			.setButtonText(" Pause")
			.onClick(this.pauseRecording.bind(this))
			.buttonEl.addClass("pause");
		this.pauseButton.setIcon("pause"); // Ensure icon is set after styling
		
		// Add stop button
		this.stopButton = new ButtonComponent(buttonGroupEl);
		this.stopButton
			.setButtonText(" Stop")
			.onClick(this.stopRecording.bind(this))
			.buttonEl.addClass("stop");
		this.stopButton.setIcon("square"); // Ensure icon is set after styling

		this.pauseButton.setDisabled(true);
		this.pauseButton.buttonEl.addClass("disabled")
		this.stopButton.setDisabled(true)
		this.stopButton.buttonEl.addClass("disabled")
	}

	async startRecording() {
		console.log("start");
		this.plugin.statusBar.updateStatus(RecordingStatus.Recording);
		await this.plugin.recorder.startRecording();
		this.plugin.timer.start();
		this.resetGUI();
	}

	async pauseRecording() {
		console.log("pausing recording...");
		await this.plugin.recorder.pauseRecording();
		this.plugin.timer.pause();
		this.resetGUI();
	}

	async stopRecording() {
		console.log("stopping recording...");
		this.plugin.statusBar.updateStatus(RecordingStatus.Processing);
		const blob = await this.plugin.recorder.stopRecording();
		this.plugin.timer.reset();
		this.resetGUI();

		const extension = this.plugin.recorder.getMimeType()?.split("/")[1];
		const fileName = `${new Date()
			.toISOString()
			.replace(/[:.]/g, "-")}.${extension}`;
		await this.plugin.audioHandler.sendAudioData(blob, fileName);
		this.plugin.statusBar.updateStatus(RecordingStatus.Idle);
		this.close();
	}

	updateTimerDisplay() {
		this.timerDisplay.textContent = this.plugin.timer.getFormattedTime();
	}

	resetGUI() {
		const recorderState = this.plugin.recorder.getRecordingState();

		if (recorderState === "recording" || recorderState === "paused") {
			this.startButton.setDisabled(true);
			this.startButton.buttonEl.addClass("disabled")
		} else {
			this.startButton.setDisabled(false);
			this.startButton.buttonEl.addClass("start")
		}

		if (recorderState === "inactive") {
			this.pauseButton.setDisabled(true);
			this.pauseButton.buttonEl.addClass("disabled")
			this.stopButton.setDisabled(true)
			this.stopButton.buttonEl.addClass("disabled")
		} else {
			this.pauseButton.setDisabled(false);
			this.pauseButton.buttonEl.addClass("pause")
			this.stopButton.setDisabled(false)
			this.stopButton.buttonEl.addClass("stop")
		}

		if (recorderState === "paused") {
			this.pauseButton.setButtonText("Resume")
			this.pauseButton.setIcon("play")
		} else {
			this.pauseButton.setButtonText("Pause")
			this.pauseButton.setIcon("pause")
		}

		if (!recorderState) {
			this.pauseButton.setDisabled(true);
			this.pauseButton.buttonEl.addClass("disabled")
			this.stopButton.setDisabled(true)
			this.stopButton.buttonEl.addClass("disabled")
		}
	}
}