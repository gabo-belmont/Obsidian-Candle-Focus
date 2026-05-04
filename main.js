/* 
    Candle Focus Plugin for Obsidian
    An optimized focus effect using CSS masks and variables.
    Updated for strict workspace scoping and resource management.
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

        this.ribbonIconEl = this.addRibbonIcon('reading-candle', 'Candle Focus', () => {
            this.toggleEffect();
        });

        this.addSettingTab(new FocusSettingTab(this.app, this));

        this.updateScrollPos = (evt) => {
            if (!this.settings.enabled) return;
            
            const target = evt.target;
            if (target && target.classList.contains('cm-scroller')) {
                const factor = Math.min(target.scrollTop / 200, 1);
                
                window.requestAnimationFrame(() => {
                    // SCOPE FIX: Apply properties to workspace container instead of document.body
                    this.app.workspace.containerEl.style.setProperty('--scroll-edge-factor', factor.toString());
                });
            }
        };

        // BEST PRACTICE: Using this.registerDomEvent ensures auto-cleanup on unload
        this.registerDomEvent(window, 'scroll', this.updateScrollPos, true);
        
        this.refreshVisuals();
    }

    onunload() {
        // CLEANUP: Scoped cleanup for workspace container
        const container = this.app.workspace.containerEl;
        container.classList.remove('has-focus-scroll');
        container.style.removeProperty('--scroll-edge-factor');
        container.style.removeProperty('--focus-height');
        container.style.removeProperty('--focus-offset');
        container.style.removeProperty('--focus-smoothing');
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

    refreshVisuals() {
        const container = this.app.workspace.containerEl;
        if (this.settings.enabled) {
            container.classList.add('has-focus-scroll');
            this.ribbonIconEl?.classList.add('is-active');
            this.updateVariables();
        } else {
            container.classList.remove('has-focus-scroll');
            this.ribbonIconEl?.classList.remove('is-active');
        }
    }

    updateVariables() {
        // SCOPE FIX: Injected variables into workspace container
        const containerStyle = this.app.workspace.containerEl.style;
        containerStyle.setProperty('--focus-height', `${this.settings.focusHeight}%`);
        containerStyle.setProperty('--focus-offset', `${this.settings.focusOffset}%`);
        containerStyle.setProperty('--focus-smoothing', `${this.settings.focusSmoothing}%`);
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