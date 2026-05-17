const { prepareYaml, parseYaml } = require("./yaml");
const { renderBlock } = require("../render/renderer");

// main logic for metadata blocks
async function processBlock(source, el, ctx, settings) {

  const prepared = prepareYaml(source); // clean up to make it work without perfect measuring yaml format
  const meta = parseYaml(prepared); // get dict object

  await renderBlock(el, meta, null, ctx, prepared, settings); // finally render
}

module.exports = { processBlock };