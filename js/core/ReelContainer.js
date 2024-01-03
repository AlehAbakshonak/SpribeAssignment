import * as PIXI from "../lib/pixi.mjs";
import {Symbol} from "./Symbol.js";

export class ReelContainer {
   /**
    * @param {number} x
    * @param {number} y
    * @param {number} w
    * @param {number} h
    * @param {number} symbolsAmount
    * @param {Texture[]} symbolTextures
    */
   constructor(x, y, w, h, symbolsAmount, symbolTextures) {
      this.container = new PIXI.Container();
      this.symbolTextures = symbolTextures;
      this.height = h;
      this.width = w;
      this.symbolsAmount = symbolsAmount;
      this.symbolHeight = this.height / this.symbolsAmount;

      this._x = x;
      this._y = y;
      this.container.x = x;
      this.container.y = y - this.symbolHeight * 0.5;
      this.symbols = [];
      this.position = 0;
      this.previousPosition = 0;
      this.blur = new PIXI.BlurFilter();
      this.blur.blurX = 0;
      this.blur.blurY = 0;
      this.maxBlur = 8;
      this.container.filters = [this.blur];
      this.#buildSymbols();
   }

   get y() {
      return this._y;
   }

   set y(value) {
      this._y = value;
      //Excluding half of height because symbol anchor is 0.5
      this.container.y = value - this.symbolHeight * 0.5;
   }

   get x() {
      return this._x;
   }

   set x(value) {
      this._x = value;
      this.container.x = value;
   }

   #updateBlur(deltaMS) {
      if (this.position % 1 !== 0) {
         const positionDelta = this.position - this.previousPosition;
         const newBlur = Math.abs(positionDelta) * this.maxBlur / (deltaMS / 60)
         this.blur.blurY = (this.blur.blurY + newBlur) / 2;
         this.previousPosition = this.position;
      }
      else this.blur.blurY = 0;
   }


   /**
    * Resizes the reel and all its symbols
    * @param {number} x
    * @param {number} y
    * @param {number} w
    * @param {number} h
    */
   resize(x, y, w, h) {
      this.width = w;
      this.height = h;
      this.symbolHeight = this.height / this.symbolsAmount;
      this.y = y;
      this.x = x;
      for (let i = 0; i < this.symbolsAmount + 1; i++) {
         const symbol = this.symbols[i];
         symbol.resize(0, i * this.symbolHeight, this.width, this.symbolHeight);
      }
   }

   startReelRotation() {

   }

   /**
    * Animation pipeline, updates the visuals of vertical position according to GSAP tween
    * @param {number} deltaMS - time since the last update for balancing the blur distance dependency
    */
   updateReel(deltaMS) {
      this.#updateBlur(deltaMS);

      for (let j = 0; j < this.symbolsAmount + 1; j++) {
         let symbol = this.symbols[j];

         symbol.y = symbol.animationY + ((this.position + j) % (this.symbolsAmount + 1)) * this.symbolHeight;

         if (symbol.y > this.height + this.symbolHeight - 5) {
            if (!symbol.randomizedOnThisTurn) {
               symbol.randomizeTexture(this.symbolTextures);
               symbol.randomizedOnThisTurn = true;
            }
         }
         else {
            symbol.randomizedOnThisTurn = false;
         }
      }
   }

   /**
    * Generates set of symbols
    */
   #buildSymbols() {
      for (let j = 0; j < this.symbolsAmount + 1; j++) {
         const symbol = new Symbol(
            0, j * this.symbolHeight,
            this.width, this.symbolHeight,
            this.symbolTextures);
         this.symbols.push(symbol);
         this.container.addChild(symbol.sprite);
      }
   }
}