import { fabric } from "fabric";
import { v4 as uuidv4 } from "uuid";
import { Menu } from "@/gameObjects/Menu";
import { MenuItem } from "@/gameObjects/MenuItem";

export let Deck = fabric.util.createClass(fabric.Image, {
  type: "Deck",
  height: 170,
  width: 120,
  label: "Deck",
  list: [],

  initialize: function (options) {
    options || (options = {});
    this.callSuper("initialize", options);
    this.set("label", this.label);
    this.set({
      height: options.height || this.height,
      width: options.width || this.width,
      id: options.id || uuidv4(),
    });
    this.setControlsVisibility({
      tr: false,
      tl: false,
      br: false,
      bl: false,
      ml: false,
      mt: false,
      mr: false,
      mb: false,
    });
  },

  getMenu: function (canvas) {
    const currentList = this.list
    return new Menu([
      new MenuItem(`${currentList.length} card${currentList.length > 1 ? "s" : ""}`, () => { }),
      new MenuItem(`Tirer la carte du dessus`, () => {
        if (currentList.length > 0)
          canvas.add(this.list.pop())
      }),
      new MenuItem(`Tirer la carte du dessous`, () => {
        if (currentList.length > 0)
          canvas.add(this.list.shift())
      }),
      new MenuItem(`Tirer une carte aléatoire`, () => {
        if (currentList.length > 0) {
          const random = this.newRandomIndex()
          canvas.add(this.list[random])
          if (random > -1) {
            this.list.splice(random, 1);
          }
        }
      }),
      new MenuItem("Rotate 90", () => {
        this.rotate(this.angle + 90);
        canvas.requestRenderAll();
      }, "http://share.pacary.net/PAO/icone/turnRight.svg"),
      new MenuItem("Rotate 180", () => {
        this.rotate(this.angle + 180);
        canvas.requestRenderAll();
      }, "http://share.pacary.net/PAO/icone/turn180.svg"),
      new MenuItem("Rote -90", () => {
        this.rotate(this.angle - 90);
        canvas.requestRenderAll();
      }, "http://share.pacary.net/PAO/icone/turnLeft.svg"),
    ]);
  },
  newRandomIndex: function () {
    return Math.floor(Math.random() * this.list.length);
  },
  onDeseleced: function (canvas) {
    this.getMenu(canvas).openMenu(false);
  },

  onMouseDown: function (canvas, e) {
    if (e.button === 3) {
      canvas.setActiveObject(this);
      this.getMenu(canvas).openMenu(true, e.pointer.x, e.pointer.y);
    }
  },
  onMoving: function (canvas) {
    this.getMenu(canvas).openMenu(false);
  },

  addToDeck: function (card) {
    this.list.push(card);
  },

  toObject: function () {
    return fabric.util.object.extend(this.callSuper("toObject"), {
      label: this.get("label"),
    });
  },

  _render: function (ctx) {
    this.callSuper("_render", ctx);
    ctx.font = "20px Helvetica";
    ctx.fillText(this.label, -this.width / 5, -this.height / 50);
  },
});
