const yaml = require("js-yaml");

function prepareYaml(raw) {
    return raw
        .replace(/\t/g, "  ")
        .replace(/\r/g, "")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
}

function parseYaml(prepared) {
    try {
        return yaml.load(prepared) || {};
    } catch (e) {
        console.error("YAML error:", e);

        return {
            error: true,
            message: e.reason,
            line: e.mark?.line,
            column: e.mark?.column
        };
    }
}

module.exports = { prepareYaml, parseYaml };