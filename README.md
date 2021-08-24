# addon-IMUI

Example addon demonstrating bidirectional data channels.

Install the tampermonkey script, drop the addon.js code in the top of your botcode.

Example script:

```
var mining = UI.toggle("Harvesting", {def: true});
UI.line();

UI.beginCol();

UI.label("Harassers");
UI.line();
UI.label("Buffer");
UI.line();
UI.label("Attacking");

UI.endCol();

UI.beginCol({grow: true});

var harassing = UI.range("harassing", 0, 100);
UI.line();
var buffer = UI.range("buffer", 0, 50);
UI.line();
var attacking = UI.range("attacking", 0, 1000);

UI.endCol();

UI.done();
```

![image](https://user-images.githubusercontent.com/1445195/130674929-46198721-976b-475f-acbb-3f9f5b379f91.png)

