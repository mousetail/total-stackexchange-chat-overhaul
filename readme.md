# Getting Started

1. Install the userscript:

```js
// ==UserScript==
// @name     New Chat
// @version  1
// @grant    none
// @match    *://chat.stackexchange.com/new_chat
// @run-at      document-start
// ==/UserScript==


document.addEventListener('DOMContentLoaded', ()=>{

  document.head.replaceChildren();
  document.body.replaceChildren();
  document.body.parentElement.replaceWith(document.body.parentElement.cloneNode(true));

  fetch("http://localhost:8000/index.html", {'cache': 'reload'}).then(
      (r)=>r.text()  
  ).then(
      (r)=>{
           const parser = new DOMParser();
           const replacementDocument = parser.parseFromString(r, 'text/html');


           let scripts = replacementDocument.body.querySelectorAll('script');
           for (let script of scripts) {
                script.parentElement.removeChild(script); 
           }

           document.head.replaceChildren(...replacementDocument.head.children);
           document.body.replaceChildren(...replacementDocument.body.children);
           for (let script of scripts) {
                let new_script = document.createElement('script');
                new_script.src = script.src;
                new_script.defer = script.defer;
                new_script.module = script.module;
                document.body.appendChild(new_script);
           }

      }
  )	
});


window.stop();

const head = document.createElement('head');
const body = document.createElement('body');
document.documentElement.appendChild(head);
document.documentElement.appendChild(body);
```

2. Run `npx parcel watch src/index.html --public-url http://localhost:8000 --hmr-host localhost`
3. In the `dist` folder run `python -m http.server`
4. Go to `chat.stackexchange.con/new_chat` in your browser. You should now see the chat app.