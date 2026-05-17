const { Plugin, PluginSettingTab, Setting } = require("obsidian");
const { processBlock } = require("./core/processor");
import { DEFAULT_SETTINGS } from "./settings";
import { t } from "./i18n";

module.exports = class InlineMetadataPlugin extends Plugin {
  async loadSettings() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async onload() {
    this.addSettingTab(new MySettingTab(this.app, this));
    await this.loadSettings();

    // register codeblock processor
    this.registerMarkdownCodeBlockProcessor(
      this.settings.metadataPrefix,
      async (source, el, ctx,) => {
        await processBlock(source, el, ctx, this.settings);
      }
    );
  }
};

class MySettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    // date format
    new Setting(containerEl)
      .setName(t("dateFormat"))
      .setDesc(t("dateFormatDesc"))
      .addText(text =>
        text
          .setPlaceholder("YYYY-MM-DD HH:mm")
          .setValue(this.plugin.settings.dateTimeFormat)
          .onChange(async (value) => {
            this.plugin.settings.dateTimeFormat = value;
            await this.plugin.saveSettings();
          })
      );

    // metadata prefix
    new Setting(containerEl)
      .setName(t("metadataPrefix"))
      .setDesc(t("metadataPrefixDesc"))
      .addText(text =>
        text
          .setPlaceholder("meta")
          .setValue(this.plugin.settings.metadataPrefix)
          .onChange(async (value) => {
            this.plugin.settings.metadataPrefix = value;
            await this.plugin.saveSettings();
          })
      );
  }
}