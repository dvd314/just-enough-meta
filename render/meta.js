const popoverStack = [];

const openedSimbol = "⯆";
const closedSimbol = "⯈";

function closePopover(p) {
    p.el.classList.remove("is-open");
    p.el.classList.add("is-closed");
    p.toggle.setText(closedSimbol);

    const el = p.el;

    setTimeout(() => {
        if (el.isConnected) el.remove();
    }, 150);
}

function createPopover(anchor, toggle, render) {
    const popover = document.createElement("div");
    popover.className = "im-popover";

    document.body.appendChild(popover);

    render(popover);

    return {
        el: popover
    };
}

function openPopover(anchor, level, toggle, render) {
    const existing = popoverStack[level];
    startTracking();

    if (existing && existing.anchor === anchor) {
        while (popoverStack.length > level) {
            closePopover(popoverStack.pop());
        }
        return;
    }

    while (popoverStack.length > level) {
        closePopover(popoverStack.pop());
    }

    if (popoverStack[level]) {
        popoverStack[level].toggle.setText(closedSimbol);
        closePopover(popoverStack[level]);
        popoverStack.splice(level, 1);
    }

    const pop = createPopover(anchor, toggle, render);
    positionPopover(anchor, pop.el);

    popoverStack[level] = {
        ...pop,
        anchor,
        toggle
    };
    
    toggle.setText(openedSimbol);
    requestAnimationFrame(() => pop.el.classList.add("is-open"));

    return pop.el;
}

// render

function renderMeta(container, meta, settings) {
    const metaEl = container.createSpan({ cls: "im-meta" });
    console.log(meta);
    renderValues(metaEl, meta, 0, settings);
}

function renderValues(metaEl, meta, level, settings) {
    Object.entries(meta).forEach(([k, v]) => {
        const wrapper = metaEl.createDiv({ cls: "im-meta-item-wrapper" });
        const item = renderValue(wrapper, v, k, settings, level);

    });
}

function renderValue(container, value, key, settings = null, level = 0) {
    const item = container.createDiv({ cls: "im-meta-item" });
    item.addClass(`im-type-${typeof value}`);

    let keyEl;

    if (key) {
        keyEl = item.createSpan({
            cls: "im-meta-key",
            text: key
        });
    }

    if (value === null) item.addClass("im-type-null");
    const valueEl = item.createSpan({
        cls: "im-meta-value"
    });

    if (value === null) {
        valueEl.setText("null");
        return item;
    }

    if (value === undefined) {
        valueEl.setText("undefined");
        return item;
    }

    // array

    if (Array.isArray(value)) {
        valueEl.setText(closedSimbol);
        valueEl.addClass("im-toggle");
        const toggle = valueEl;

        item.addClass("is-expandable");

        item.addEventListener("click", (e) => {
            e.stopPropagation();

            const pop = openPopover(item, level, toggle, (wrapper) => {
                if (value.length === 0) {
                    renderValue(wrapper, "empty", null, settings, level + 1);
                    return;
                }
                value.forEach(v => {
                    renderValue(wrapper, v, null, settings, level + 1);
                });
            });
            pop?.addClass(`im-type-${typeof value}`);
        });

        return item;
    }

    // object

    if (value?.constructor === Object) {
        valueEl.setText(closedSimbol);
        valueEl.addClass("im-toggle");
        const toggle = valueEl;

        item.addEventListener("click", (e) => {
            e.stopPropagation();

            const pop = openPopover(item, level, toggle, (wrapper) => {
                if (Object.entries(value).length === 0) {
                    renderValue(wrapper, "empty", null, settings, level + 1);
                    return;
                }
                Object.entries(value).forEach(([k, v]) => {
                    renderValue(wrapper, v, k, settings, level + 1);
                });
            });
            pop?.addClass(`im-type-${typeof value}`);
        });

        return item;
    }

    // primitive

    if (typeof value === "boolean") {
        const checkbox = valueEl.createEl("input", {
            type: "checkbox"
        });

        checkbox.checked = value;
        checkbox.disabled = true;
        return item;
    }

    if (typeof value === "string" && value.includes("\n")) {
        valueEl.setText(value);
        valueEl.addClass("is-multiline");
        slowScroll(valueEl, 0.05);
        return item;
    }

    if (typeof value === "number") {
        if (!isFinite(value)) {
            valueEl.setText(String(value));
            return item;
        }
    }

    if (value instanceof Date) {
        const text = window.moment(value).format(settings.dateTimeFormat);

        valueEl.setText(text);
        valueEl.setAttr("title", value.toISOString());

        return;
    }

    valueEl.setAttr("title", String(value));
    valueEl.setText(String(value));

    return item;
}

// positioning

function positionPopover(anchor, popover) {
    const rect = anchor.getBoundingClientRect();
    const stylesP = getComputedStyle(popover);

    const paddingLeftP = parseFloat(stylesP.paddingLeft) || 0;
    const paddingTopP = parseFloat(stylesP.paddingTop) || 0;

    const parent = anchor.parentElement;
    const stylesA = getComputedStyle(parent);

    const paddingLeftA = parseFloat(stylesA.paddingLeft) || 0;
    const paddingTopA = parseFloat(stylesA.paddingTop) || 0;

    const offset = 5;

    const x = rect.right + window.scrollX + paddingLeftP + paddingLeftA + offset;
    const y = rect.top + window.scrollY - paddingTopA - paddingTopP - 1;

    popover.style.left = `${x}px`;
    popover.style.top = `${y}px`;
}

function updateAllPopovers() {
    popoverStack.forEach(p => {
        positionPopover(p.anchor, p.el);
    });
}

// global close

window.addEventListener("click", (e) => {
    const clickedInsidePopover = popoverStack.some(p =>
        p.el.contains(e.target)
    );

    if (clickedInsidePopover) return;

    while (popoverStack.length) {
        closePopover(popoverStack.pop());
    }
});

window.addEventListener("resize", updateAllPopovers);

let ticking = false;

window.addEventListener("scroll", () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateAllPopovers();
            ticking = false;
        });
        ticking = true;
    }
});

let tracking = false;

function startTracking() {
    if (tracking) return;
    tracking = true;

    let lastRects = new Map();

    function loop() {
        if (!popoverStack.length) {
            tracking = false;
            return;
        }

        popoverStack.forEach(p => {
            const rect = p.anchor.getBoundingClientRect();
            const prev = lastRects.get(p);

            if (
                !prev ||
                prev.left !== rect.left ||
                prev.top !== rect.top ||
                prev.width !== rect.width ||
                prev.height !== rect.height
            ) {
                positionPopover(p.anchor, p.el);
                lastRects.set(p, rect);
            }
        });

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}

function slowScroll(el, factor = 0.3) {
    let target = el.scrollTop;

    el.addEventListener("wheel", (e) => {
        e.preventDefault();

        target += e.deltaY * factor;

        el.scrollTo({
            top: target,
            behavior: "smooth"
        });
    }, { passive: false });
}

function formatDate(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function pad(n) {
    return String(n).padStart(2, "0");
}

module.exports = { renderMeta };