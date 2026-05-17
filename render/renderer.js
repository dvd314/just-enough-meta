const { renderContent } = require("./content");
const { renderMeta } = require("./meta");

function filterMeta(meta, display) {
    if (!display) return meta;

    let entries = Object.entries(meta);

    if (display.include && display.exclude) {
        return { "Error": "Cannot use include and exclude together" };
    }
    if (display.include) {
        entries = entries.filter(([k]) => display.include.includes(k));
    }

    if (display.exclude) {
        entries = entries.filter(([k]) => !display.exclude.includes(k));
    }

    return Object.fromEntries(entries);
}

function splitMeta(meta) {
    const { _config, ...data } = meta;
    return {
        data,
        config: _config || {}
    };
}

async function renderBlock(container, meta, content, ctx, raw, settings) {
    container.empty();

    if (meta?.error) {
        renderError(container, meta, raw);
        return;
    }

    const block = container.createDiv({ cls: "im-block" });

    const { data, config } = splitMeta(meta);

    if (config.display === false) return;

    const filtered = filterMeta(data, config);

    renderMeta(block, filtered, settings);

    // spacing
    if (config.spacing) {
        if (config.spacing.marginTop != null) {
            block.style.marginTop = config.spacing.marginTop + "px";
        }
        if (config.spacing.marginBottom != null) {
            block.style.marginBottom = config.spacing.marginBottom + "px";
        }
    }
}

function renderError(container, error, raw) {
    const block = container.createDiv({ cls: "im-block im-error" });

    block.createDiv({
        cls: "im-error-title",
        text: "YAML Error"
    });

    block.createDiv({
        cls: "im-error-message",
        text: error.message || "Unknown error"
    });

    if (!raw) return;

    const lines = raw.split("\n");
    if (error.line >= lines.length) {
        lines.push("");
    }

    const start = Math.max(0, error.line - 2);
    const end = Math.min(lines.length, error.line + 3);

    const code = block.createDiv({ cls: "im-error-code" });


    lines.slice(start, end).forEach((line, i) => {
        const lineEl = code.createDiv({
            cls: "im-error-line"
        });

        const isErrorLine = i === error.line;

        if (isErrorLine) {
            lineEl.addClass("is-error");
        }

        lineEl.createSpan({
            cls: "im-error-line-number",
            text: String(i + 1)
        });

        const content = lineEl.createSpan({
            cls: "im-error-line-content"
        });

        // render error
        if (isErrorLine && error.column != null) {
            const col = Math.min(error.column ?? 0, line.length);

            const before = line.slice(0, col);
            const char = line[col] || " ";
            const visibleChar = char === " " ? "·" : char;
            const after = line.slice(col + 1);

            content.createSpan({ text: before });
            content.createSpan({
                cls: "im-error-char",
                text: visibleChar
            });

            content.createSpan({ text: after });
        } else {
            content.setText(line);
        }
    });
}

module.exports = { renderBlock };