import Plugin from "main";
import { ButtonComponent, Modal } from "obsidian";
import { RecordingStatus } from "./StatusBar";

const buttonGroup = `
	display: flex;
	justify-content: center;
	gap: 10px;
	padding: 5px;
`

const timer = `
	font-family: 'Courier New', monospace;
	display: flex;
	justify-content: center;
	font-size: 48px;
	font-weight: bold;
	padding: 10px;
	border-radius: 5px;
	letter-spacing: 2px;
`

const buttonBase = `
	color: white;
	border: none;
	padding: 10px 20px;
	border-radius: 5px;
	font-size: 16px;
	cursor: pointer;
	margin: 5px;
`

const disabled = `
	${buttonBase}
	background-color: gray;
`

const start = `
	${buttonBase}
	background-color: green;
`

const pause = `
	${buttonBase}
	background-color: orange;
`

const stop = `
	${buttonBase}
	background-color: red;
`

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
		this.timerDisplay = this.contentEl.createEl("div", { attr:{style:timer} });
		this.updateTimerDisplay();

		// Set onUpdate callback for the timer
		this.plugin.timer.setOnUpdate(() => {
			this.updateTimerDisplay();
		});

		// Add button group
		const buttonGroupEl = this.contentEl.createEl("div", {attr: {style: buttonGroup}});
		
		//Add the start button
		this.startButton = new ButtonComponent(buttonGroupEl);
		this.startButton
			.setButtonText(" Record")
			.onClick(this.startRecording.bind(this))
			.buttonEl.setAttr("style", start);
		this.startButton.setIcon("microphone"); // Ensure icon is set after styling
		
		// Add pause button
		this.pauseButton = new ButtonComponent(buttonGroupEl);
		this.pauseButton
			.setButtonText(" Pause")
			.onClick(this.pauseRecording.bind(this))
			.buttonEl.setAttr("style", pause);
		this.pauseButton.setIcon("pause"); // Ensure icon is set after styling
		
		// Add stop button
		this.stopButton = new ButtonComponent(buttonGroupEl);
		this.stopButton
			.setButtonText(" Stop")
			.onClick(this.stopRecording.bind(this))
			.buttonEl.setAttr("style", stop);
		this.stopButton.setIcon("square"); // Ensure icon is set after styling

		this.pauseButton.setDisabled(true);
		this.pauseButton.buttonEl.setAttr("style", disabled)
		this.stopButton.setDisabled(true)
		this.stopButton.buttonEl.setAttr("style", disabled)
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
			this.startButton.buttonEl.setAttr("style", disabled)
		} else {
			this.startButton.setDisabled(false);
			this.startButton.buttonEl.setAttr("style", start)
		}

		if (recorderState === "inactive") {
			this.pauseButton.setDisabled(true);
			this.pauseButton.buttonEl.setAttr("style", disabled)
			this.stopButton.setDisabled(true)
			this.stopButton.buttonEl.setAttr("style", disabled)
		} else {
			this.pauseButton.setDisabled(false);
			this.pauseButton.buttonEl.setAttr("style", pause)
			this.stopButton.setDisabled(false)
			this.stopButton.buttonEl.setAttr("style", stop)
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
			this.pauseButton.buttonEl.setAttr("style", disabled)
			this.stopButton.setDisabled(true)
			this.stopButton.buttonEl.setAttr("style", disabled)
		}
	}
}