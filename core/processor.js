const { prepareYaml, parseYaml } = require("./yaml");
const { renderBlock } = require("../render/renderer");

async function processBlock(source, el, ctx, settings) {

  const prepared = prepareYaml(source);
  const meta = parseYaml(prepared);

  await renderBlock(el, meta, null, ctx, prepared, settings);
}

module.exports = { processBlock };