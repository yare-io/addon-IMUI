{
    let UIChan = channels.get('UI');
    if(!UIState) {
        var UIState = {};
    }
    let idkey = 0;
    let group = [];
    let stack = [group];
    var UI = {
        tick() {
            let data = channels.recv('UI');
            if(data) {
                for(var d of data) {
                    UIState[d.key] = d.value;
                }
            }
            idkey = 0;
            group = [];
            stack = [group];
        },
        done() {
            UIChan.send(group);
        },
        button(name, {key = name} = {}) {
            stack[0].push({t: 'button', name, key});
            old = UIState[key];
            UIState[key] = false;
            return old;
        },
        toggle(name, {key = name, def = false} = {}) {
            let val = UIState[key] ?? def;
            stack[0].push({t: 'toggle', name, key, val});
            return val;
        },
        line() {
            stack[0].push({t: 'line', key: idkey++});
        },
        field(key, {def = ''} = {}) {
            let val = UIState[key] ?? def;
            stack[0].push({t: 'field', key, val});
            return val;
        },
        label(label) {
            stack[0].push({t: 'label', label: label, key: idkey++});
        },
        range(key, min, max, {def = min} = {}) {
            let val = UIState[key] ?? def;
            stack[0].push({t: 'range', min, max, key, val});
            return val;
        },
        select(key, options, {def} = {}) {
            let val = UIState[key] ?? def;
            if(Array.isArray(options)) {
                options = Object.fromEntries(options.map(opt => ([opt, opt])));
            }
            stack[0].push({t: 'select', options, key, val});
            return val;
        },
        pickSpot(name, {key = name} = {}) {
            stack[0].push({t: 'pickSpot', name, key});
            return UIState[key];
        },
        beginCol({grow = false} = {}) {
            let newCol = [];
            stack[0].push({t: 'col', items: newCol, key: idkey++, grow});
            stack.unshift(newCol);
        },
        endCol() {
            stack.shift();
        }
    }
}
