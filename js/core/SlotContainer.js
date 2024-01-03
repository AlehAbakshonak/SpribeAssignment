import * as PIXI from "../lib/pixi.mjs";
import {ReelContainer} from "./ReelContainer.js";
import {gsap} from "../lib/gsap_esm/gsap-core.js";

export class SlotContainer {
   /**
    * @param {number} x
    * @param {number} y
    * @param {number} w
    * @param {number} h
    * @param {number} reelsAmount - number of columns
    * @param {number} symbolsAmount - number of rows, must be an odd number
    * @param {Texture[]} slotTextures
    */
   constructor(x, y,
               w, h,
               reelsAmount, symbolsAmount, slotTextures) {
      this.container = new PIXI.Container("slot");
      this.container.x = x;
      this.container.y = y;
      this.width = w;
      this.height = h;
      this.reelsAmount = reelsAmount;
      this.reelWidth = this.width / this.reelsAmount;
      this.symbolsAmount = symbolsAmount % 2 === 0 ? symbolsAmount + 1 : symbolsAmount;
      this.reels = [];
      this.slotTextures = slotTextures;
      this.#buildReels();

      this.rotationRunning = false;
      this.reelsRotating = 0;
   }

   /**
    * Resizes the container recursively down to symbols
    * @param {number} w
    * @param {number} h
    */
   resize(w, h) {
      this.width = w;
      this.height = h;
      this.reelWidth = this.width / this.reelsAmount;
      for (let i = 0; i < this.reelsAmount; i++) {
         const reel = this.reels[i];
         reel.resize(i * this.reelWidth, 0, this.reelWidth, this.height);
      }
   }

   startRotation() {
      if (this.rotationRunning) return;
      this.rotationRunning = true;
      this.reelsRotating = this.reelsAmount;

      const reelComplete = () => {
         this.reelsRotating--;
         if (this.reelsRotating === 0) this.rotationRunning = false;
      }

      for (let i = 0; i < this.reelsAmount; i++) {
         const reel = this.reels[i];
         const extra = Math.floor(Math.random() * 3);
         const target = reel.position + 20 + i * this.reelsAmount + extra;
         const time = 2500 + i * 600 + extra * 400;
         const overTween = this.reelsAmount * (extra + 1);
         const relOverTween = overTween / (target - reel.position);

         gsap.to(
            reel,
            {
               position: target,
               ease: `expoScale(1, 2, back.out(${relOverTween + 0.2}))`,
               duration: time / 1000,
               onComplete: reelComplete
            }
         )
      }
   }

   /**
    * Animation pipeline, updates the visuals of vertical position according to GSAP tween
    * @param {number} deltaMS - time since the last update for balancing the reels blur distance dependency
    */
   updateReels(deltaMS) {
      for (const reel of this.reels) {
         reel.updateReel(deltaMS);
      }
   }

   /**
    * Generates set of reel objects
    */
   #buildReels() {
      for (let i = 0; i < this.reelsAmount; i++) {
         const reel = new ReelContainer(
            i * this.reelWidth, 0, this.reelWidth, this.height,
            this.symbolsAmount, this.slotTextures);
         this.container.addChild(reel.container);
         this.reels.push(reel);
      }
   }
}