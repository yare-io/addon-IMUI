// ==UserScript==
// @name         Yare IMUI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://yare.io/d*
// @grant        none
// ==/UserScript==

/*
switch(e.t) {
                case 'button':
                    return H('button', {
                        onclick() {
                            sendData('UI', {key: e.key, value: true});
                        }
                    },
                             e.name);
                case 'toggle':
                    return H('span', [H('input', {
                        onchange(ev) {
                            sendData('UI', {key: e.key, value: ev.target.checked});
                            state[e.key] = ev.target.checked;
                        },
                        type: "checkbox",
                        checked: state[e.key] || false,
                    }), H('label', e.name)]);
                case 'line':
                    return H('br');
                case 'label':
                    return H('span', e.label);
                case 'field':
                    return H('input', {
                        oninput(ev) {
                            sendData('UI', {key: e.key, value: ev.target.value});
                            state[e.key] = ev.target.value;
                        },
                        type: "text",
                        value: state[e.key] || '',
                    });
            }
            return H('span');
        }
                               );
                               */



(function() {

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(`
.yare-IMUI > div {
  display: flex;
  flex-wrap: wrap;
}

.yare-IMUI input {
  flex: 1 0 auto;
}

.yare-IMUI .break {
  flex-basis: 100%;
  height: 0;
}

.yare-IMUI div.col {
  display: flex;
  flex-wrap: wrap;
}

.yare-IMUI .grow {
  flex: 1 0 auto;
}

`);

    (()=>{let a=(a,b={},...c)=>({$:a,a:!b||b.$||b.concat?{c:[].concat(b||[],...c)}:(b.c=[].concat(...c),b)}),b=(a=[],b,c)=>a.map(a=>a(b,c)),c=a=>new Proxy(a,{get:(a,b,d)=>c((...c)=>((d=a(...c)).a.className=(d.a.className||" ")+" "+b,d))}),d=window.R=(a,c,e=c.childNodes,f=0)=>{for([].concat(a).map((g,h,i,j=e[f++],k=g.s=(j?j.a==g.$&&(g.s||j.s):g.s)||{},l={a:g.$,s:k,m:[],u:[],d:[]})=>{for(;(g.$||a).bind;)g=g.$(g.a,k,b=>Object.assign(k,b)&&d(a,c),l);h=g.replace?document.createTextNode(g):document.createElement(g.$),h=j?j.$!=g.$&&j.data!=g?(c.replaceChild(h,j),h):j:c.appendChild(h),i=j?j.a==l.a?l.d:(b(j.u),d([],j),l.m):l.m,Object.assign(h,g,l),g.replace?h.data=g:Object.keys(g.a).map((a)=>"style"==a?Object.assign(h[a],g.a[a]):h[a]!==g.a[a]&&(h[a]=g.a[a]))&&l.r||d(g.a.c,h),b(i,h,j)});e[f];)b(e[f].u),d([],c.removeChild(e[f]))};window.H=new Proxy(a,{get:(b,d)=>b[d]||c(a.bind(b,d))})})()
    window.K=(a,b,c="=e",d=a[c]=a[c]||{})=>Object.keys(d).map(a=>b.find(({a:{key:b}})=>b==a)||delete d[a])&&b.map(a=>(a.s=d[a.a.key]=d[a.a.key]||a.s||{})&&a)
    var state = {};
    var old = {};
    var next = {};

    const {div} = H;

    var types;

    var dont = {
        col: true,
        label: true,
    };

    function getComp(c) {
        return H(types[c.t], c);
        let name = c.t + "_" + c.key;
        if(!dont[c.t]) {
            if(name in old) {
                next[name] = old[name];
                return old[name];
            }
        }
        var comp = H(types[c.t], c);
        if(!dont[c.t]) {
            next[name] = H(types[c.t], c);
        }
        return comp;
    }

    types = {
        button(props, state, setState) {
            return H('button', {
                onclick() {
                    sendData('UI', {key: props.key, value: true});
                }
            }, props.name);
        },
        toggle(props, state, setState) {
            let {value=props.val} = state;
            return H('label',
                     H('input', {
                onchange(ev) {
                    sendData('UI', {key: props.key, value: ev.target.checked});
                    setState({value: ev.target.checked});
                },
                type: "checkbox",
                checked: value,
            }), props.name);
        },
        line() {
            return div.break();
        },
        label(props) {
            return H('span', props.label);
        },
        field(props, state, setState) {
            let {value=props.val} = state;
            return H('input', {
                oninput(ev) {
                    sendData('UI', {key: props.key, value: ev.target.value});
                    setState({value: ev.target.value});
                },
                type: "text",
                value: value,
            });
        },
        range(props, state, setState) {
            let {value=props.val, updateTimeout = false} = state;
            return H('input', {
                oninput(ev) {
                    if(!updateTimeout) {
                        setTimeout(() => {
                            sendData('UI', {key: props.key, value: +state.value})
                            setState({updateTimeout: false});
                        }, 250);
                        setState({updateTimeout: true});
                    }
                    setState({value: ev.target.value});
                },
                type: "range",
                value: value,
                min: props.min,
                max: props.max,
            });
        },
        select(props, state, setState) {
            let {value=props.val} = state;
            return H('select', {
                onchange(ev) {
                    sendData('UI', {key: props.key, value: ev.target.value});
                    setState({value: ev.target.value});
                },
            }, Object.entries(props.options).map(opt => H('option', {value: opt[1], selected: opt[1] == value}, opt[0])));
        },
        pickSpot(props, state, setState) {
            let {active=false} = state;
            if(!active) {
                return H('button',
                         {
                    onclick(ev) {
                        ev.preventDefault();
                        let eventHandler = (e) => {
                            let x = e.clientX;
                            let y = e.clientY;
                            let board_x = x*multiplier - offsetX;
                            let board_y = y*multiplier - offsetY;
                            document.removeEventListener('click', eventHandler);
                            sendData('UI', {key: props.key, value: [board_x, board_y]});
                            setState({active: false, eventHandler: null});
                        };
                        setState({active: true, eventHandler});
                        setTimeout(() => {
                            document.addEventListener('click', eventHandler)
                        }, 0);
                    }
                },
                         props.name);
            } else {
                return H('button',
                         {
                    onclick(e) {
                        e.preventDefault();
                        document.removeEventListener('click', eventHandler);
                        setState({active: false, eventHandler: null});
                    }
                },
                         "Cancel");
            }
        },
        col(props, state) {
            let {items} = props;
            if(!items) {
                return H('div');
            }
            var components = items.map(c => getComp(c));
            var classes = "col";
            if(props.grow) {
                classes += " grow";
            }
            return div({className: classes}, K(state, components));
        }
    };
    function renderUI(props, state) {
        let {items} = props;
        if(!items) {
            return H('div');
        }
        var components = items.map(c => getComp(c));
        return H('div', K(state, components));
    }
    var ele = document.createElement('div');
    document.body.appendChild(ele);
    ele.style.position = 'absolute';
    ele.style.bottom = 0;
    ele.style.width = '50%';
    ele.style.left = '25%';
    ele.style.backgroundColor = 'rgb(48, 45, 51)';
    ele.style.border = '12px';
    ele.style.borderRadius = '12px';
    ele.style.padding = '12px';
    ele.className = 'yare-IMUI';
    document.addEventListener('chan', (e) => {
        old = next;
        next = {};
        R(H(renderUI, {items: e.detail.UI[0]}), ele);
    });
})();
