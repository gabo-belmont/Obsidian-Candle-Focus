/* 
    Candle Focus Plugin for Obsidian
    An optimized focus effect using CSS masks and variables.
*/

const { Plugin, PluginSettingTab, Setting, addIcon } = require('obsidian');

const CANDLE_ICON = `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M40 90h20M50 90V70M35 70h30v-5c0-10-5-15-5-25V25c0-5-10-5-10 0v15c0 10-5 15-5 25v5z" />
    <path d="M50 25c2-5 8-5 5-15-5 0-7 10-5 15z" fill="currentColor" />
</svg>`;

const DEFAULT_SETTINGS = {
    focusHeight: 30,
    focusOffset: 0,
    focusSmoothing: 10,
    enabled: true
};

module.exports = class FocusScrollPlugin extends Plugin {
    async onload() {
        await this.loadSettings();
        addIcon('reading-candle', CANDLE_ICON);

        // Add ribbon icon to toggle the effect
        this.ribbonIconEl = this.addRibbonIcon('reading-candle', 'Candle Focus', () => {
            this.toggleEffect();
        });

        this.addSettingTab(new FocusSettingTab(this.app, this));

        // Optimized scroll listener: updates only the scroll-edge-factor
        this.updateScrollPos = (evt) => {
            if (!this.settings.enabled) return;
            
            const target = evt.target;
            // Ensure we are targeting the CodeMirror scroller
            if (target && target.classList.contains('cm-scroller')) {
                const factor = Math.min(target.scrollTop / 200, 1);
                
                // Use requestAnimationFrame for smoother visual updates synced with the browser's refresh rate
                window.requestAnimationFrame(() => {
                    document.body.style.setProperty('--scroll-edge-factor', factor.toString());
                });
            }
        };

        // Listen for scroll events in the capture phase for better performance
        window.addEventListener('scroll', this.updateScrollPos, true);
        
        // Initial visual sync
        this.refreshVisuals();
    }

    onunload() {
        // Cleanup to prevent memory leaks and residual styles
        window.removeEventListener('scroll', this.updateScrollPos, true);
        document.body.classList.remove('has-focus-scroll');
        document.body.style.removeProperty('--scroll-edge-factor');
    }

    async toggleEffect() {
        this.settings.enabled = !this.settings.enabled;
        await this.saveSettings();
        this.refreshVisuals();
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    // refreshVisuals handles state and class toggling
    refreshVisuals() {
        if (this.settings.enabled) {
            document.body.classList.add('has-focus-scroll');
            this.ribbonIconEl?.classList.add('is-active');
            this.updateVariables();
        } else {
            document.body.classList.remove('has-focus-scroll');
            this.ribbonIconEl?.classList.remove('is-active');
        }
    }

    // updateVariables injects static settings into CSS variables
    updateVariables() {
        const style = document.body.style;
        style.setProperty('--focus-height', `${this.settings.focusHeight}%`);
        style.setProperty('--focus-offset', `${this.settings.focusOffset}%`);
        style.setProperty('--focus-smoothing', `${this.settings.focusSmoothing}%`);
    }
};

class FocusSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Focus Configuration' });

        new Setting(containerEl)
            .setName('Effect Enabled')
            .setDesc('Toggle the focus mask on or off')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enabled)
                .onChange(async (value) => {
                    this.plugin.settings.enabled = value;
                    await this.plugin.saveSettings();
                    this.plugin.refreshVisuals();
                }));

        new Setting(containerEl)
            .setName('Focus zone width')
            .setDesc('How much of the text remains visible')
            .addSlider(slider => slider
                .setLimits(1, 100, 1)
                .setValue(this.plugin.settings.focusHeight)
                .onChange(async (value) => {
                    this.plugin.settings.focusHeight = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateVariables();
                }));

        new Setting(containerEl)
            .setName('Brightness smoothness')
            .setDesc('Gradient intensity for the focus edges')
            .addSlider(slider => slider
                .setLimits(0, 25, 1)
                .setValue(this.plugin.settings.focusSmoothing)
                .onChange(async (value) => {
                    this.plugin.settings.focusSmoothing = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateVariables();
                }));

        new Setting(containerEl)
            .setName('Focus zone vertical offset')
            .setDesc('Adjust the vertical center of the focus area')
            .addSlider(slider => slider
                .setLimits(-45, 45, 1)
                .setValue(this.plugin.settings.focusOffset)
                .onChange(async (value) => {
                    this.plugin.settings.focusOffset = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateVariables();
                }));
    }
}