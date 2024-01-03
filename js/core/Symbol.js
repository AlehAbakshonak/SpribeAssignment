import * as PIXI from "../lib/pixi.mjs";
import {gsap} from "../lib/gsap_esm/gsap-core.js";

export class Symbol {
   /**
    * @param {number} x
    * @param {number} y
    * @param {number} w
    * @param {number} h
    * @param {Texture[]} possibleTextures
    */
   constructor(x, y, w, h, possibleTextures) {
      this.width = w;
      this.height = h;
      this.sprite = new PIXI.Sprite(this.#getRandomTexture(possibleTextures));
      this._x = x;
      this._y = y;
      this.sprite.y = y;
      this.sprite.anchor.set(0.5);
      this.randomizedOnThisTurn = false;
      this.#calculateTexturePosition();
      this.buildIdleAnimation(0.02,0.75,1.5);
   }

   get x() {
      return this._x;
   }

   set x(value) {
      this._x = value;
      this.sprite.x = value;
   }

   get y() {
      return this._y;
   }

   set y(value) {
      this._y = value;
      this.sprite.y = value;
   }

   buildIdleAnimation(rotationRate, yJumpRate, duration) {
      this.sprite.rotation = -rotationRate;

      this.animationY = 0;
      this.animation = gsap.timeline({defaults: {yoyo: true, repeat: -1}});
      this.animation.to(
         this.sprite,
         {
            rotation: rotationRate,
            ease: `power1.inOut`,
            duration: duration
         }
      )
      this.animation.to(
         this,
         {
            animationY: -yJumpRate,
            ease: `power1.inOut`,
            duration: duration / 2
         },
         "<"
      )
      this.animation.progress(Math.random());
   }

   /**
    * Resizes the sprite and realigns it according to the new reel height.
    * Also rescales it and centers again.
    * @param {number} x
    * @param {number} y
    * @param {number} w
    * @param {number} h
    */
   resize(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
      this.#calculateTexturePosition();
   }

   /**
    * Rescales the sprite and centers according to its new scale.
    */
   #calculateTexturePosition() {
      let scaleMult = 0.9;
      this.sprite.scale = {x: 1, y: 1};
      this.sprite.scale.x = this.sprite.scale.y =
         Math.min(this.width, this.height) / this.sprite.height * scaleMult;

      //Adding half of the width because anchor is 0.5
      this.sprite.x = (this.width - this.sprite.width) / 2 + this.sprite.width * 0.5;
   }

   /**
    * Returns random texture from provided texture collection
    * @param {Texture[]} possibleTextures
    */
   #getRandomTexture(possibleTextures) {
      const randomTextureIndex = Math.floor(Math.random() * possibleTextures.length);
      return possibleTextures[randomTextureIndex];
   }

   /**
    * Assigns random texture from provided texture collection to existing sprite
    * @param {Texture[]} possibleTextures
    */
   randomizeTexture(possibleTextures) {
      this.sprite.texture = this.#getRandomTexture(possibleTextures);
      this.#calculateTexturePosition();
   }
}