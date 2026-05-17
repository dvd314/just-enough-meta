const { MarkdownRenderer, MarkdownRenderChild } = require("obsidian");

async function renderContent(block, content, ctx) {
  const contentEl = block.createDiv({ cls: "im-content" });

  const child = new MarkdownRenderChild(contentEl);
  ctx.addChild(child);

  await MarkdownRenderer.renderMarkdown(
    content.join("\n"),
    contentEl,
    ctx.sourcePath,
    child
  );
}

module.exports = { renderContent };