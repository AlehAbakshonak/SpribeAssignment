import * as PIXI from "./lib/pixi.mjs";

import {gsap} from "./lib/gsap_esm/gsap-core.js";
import {assetMap} from "../assets/assetMap.js";
import {SlotContainer} from "./core/SlotContainer.js";

import {ExpoScaleEase} from "./lib/gsap_esm/EasePack.js";

gsap.registerPlugin(ExpoScaleEase);

const canvas = document.getElementById("canvas");

const app = new PIXI.Application({
   background: '#1099bb',
   width: canvas.clientWidth * window.devicePixelRatio,
   height: canvas.clientHeight * window.devicePixelRatio,
   view: canvas,
});

const containers = [];

await PIXI.Assets.init(assetMap);
PIXI.Assets.loadBundle("slot-icons").then(init);

function init(assets) {
   const slotTextures = Object.values(assets);

   const slotContainer = new SlotContainer(
      0, 0,
      app.screen.width, app.screen.height,
      5, 3, slotTextures);
   containers.push(slotContainer);
   app.stage.addChild(slotContainer.container);

   console.log(document.body.style.scale);

   window.addEventListener('resize', () => {
      const newWidth = canvas.clientWidth * window.devicePixelRatio;
      const newHeight = canvas.clientHeight * window.devicePixelRatio;
      app.renderer.resize(newWidth, newHeight);
      slotContainer.resize(newWidth, newHeight);
   });


   const playButton = document.getElementById("playButton");
   playButton.addEventListener('pointerdown', startPlay);

   function startPlay() {
      slotContainer.startRotation();
   }

   //app.ticker.maxFPS = 20;

   app.ticker.add(() => {
      slotContainer.updateReels(app.ticker.deltaMS);
   });
}