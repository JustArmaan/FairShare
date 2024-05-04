/* example starter from vite-express
import './style.css';

import { setupCounter } from './counter';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
*/

//const nav = document.querySelector("#nav")
document.body.addEventListener('htmx:afterSwap', () => {
  window.scrollTo({ top: 0 });
});

// @ts-ignore
const handler = Plaid.create({
  token: '',
  onSuccess: (public_token: string, metadata: any) => { },
  onLoad: () => { },
  onExit: (err: any | null, metadata: any) => { },
  onEvent: (eventName: any | null, metadata: any) => { },
});
