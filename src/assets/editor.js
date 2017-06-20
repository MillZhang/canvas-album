/**
 * 编辑器主模块
 * @authors Mill (876753183@qq.com)
 * @date    2017-06-08 17:52:29
 * @version 0.0.1
 */
import 'fabric'
//定义常量
const thumbnail = '?imageMogr2/thumbnail/600x600',
  domain = 'http://image.cache.timepack.cn/';
export default class Editor {
  constructor(id, containWidth, layout, photo) {
    this.id = id;
    this.containWidth = containWidth;
    this.layout = layout;
    this.photo = photo;
    this.reachMax = false;
    this.reachMin = false;
    this.init();
  }

  init() {
    let canvasObj = document.getElementById(this.id);
    canvasObj.width = this.containWidth;
    this.aspectRadio = this.layout.tw / this.layout.th;
    canvasObj.height = this.containWidth * this.aspectRadio;
    this.canvas = new fabric.Canvas('canvas');
    this.canvas.selection = false;
    this.sysConfig();
    this.load();
    this.moving();
    this.mouseup();
    this.setCoverImage();
  }

  /**
   * 系统参数设置
   * @return {[type]} [description]
   */
  sysConfig() {
    this.zoomRadio = (this.layout.tw / this.canvas.width).toFixed(4);
  }

  load() {
    let list = this.photo.list;
    for (let i = 0, len = list.length; i < len; i++) {
      let item = list[i];
      // this.drawRect(i)
      this.drawImage(item, i);
    }

  }

  /**
   * 设置封面背景遮罩层
   */
  setCoverImage() {
      let that = this;
      this.canvas.setOverlayImage(this.layout.pngImg + thumbnail, function(img) {
        that.canvas.overlayImage.width = that.canvas.width;
        that.canvas.overlayImage.height = that.canvas.height;
        that.canvas.renderAll();
      });
    }
    /**
     * 绘制容器
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
  drawRect(index) {
    let rect = new fabric.Rect({
      width: this.layout.area[index].aw / this.zoomRadio,
      height: this.layout.area[index].ah / this.zoomRadio,
      left: this.layout.area[index].ax / this.zoomRadio,
      top: this.layout.area[index].ay / this.zoomRadio,
      lockMovementX: true,
      lockMovementY: true,
      borderColor: '#bc223d',
      hasControls: false,
      hasBorders: false,
      fill: '#aaaaa'
    });
    this.canvas.add(rect)
  }

  /**
   * 加载图片
   * @param  {[type]} param [description]
   * @param  {[type]} index [description]
   * @return {[type]}       [description]
   */
  drawImage(param, index) {
    let that = this;
    let path = domain + param.key + thumbnail + '/rotate/' + param.degree;
    fabric.Image.fromURL(path, function(img) {
      var zoom_aw = (that.layout.area[index].aw) / that.zoomRadio,
        imagePercent = (zoom_aw / (param.width / that.zoomRadio)).toFixed(2);
      console.log(imagePercent)
      img.scale(imagePercent).set({
        left: that.layout.area[index].ax / that.zoomRadio,
        top: that.layout.area[index].ay / that.zoomRadio,
        crossOrigin: 'anonymous',
        lockMovementX: true,
        hasBorders: false,
        hasControls: false,
        e_index: index
      });
      that.canvas.add(img);
    });
  }

  /**
   * [moving description]
   * @return {[type]} [description]
   */
  moving() {
    let that = this;
    this.canvas.on("object:moving", function(e) {
      var movingObject = e.target;
      if (null == movingObject) return;
      let e_index = movingObject.e_index,
        scaleRadio = Number(movingObject.scaleX),
        photoItem = that.photo.list[e_index],
        areaItem = that.layout.area[e_index];

      let maxTop = areaItem.ay / that.zoomRadio,
        minTop = (areaItem.ay + areaItem.ah) / that.zoomRadio - photoItem.height * scaleRadio / that.zoomRadio;
      photoItem.location.position.maxTop = maxTop;
      photoItem.location.position.minTop = minTop;
      if (movingObject.top > (maxTop + 2)) {
        console.log('超过最大边界');
        that.reachMax = true;
        that.reachMin = false;
      } else if (movingObject.top < (minTop - 2)) {
        console.log('超过最小边界');
        that.reachMax = false;
        that.reachMin = true;
      } else {
        that.reachMax = false;
        that.reachMin = false;
      }
    });
  }

  mouseup() {
    let that = this;
    this.canvas.on("mouse:up", function(e) {
      var target = e.target;
      if (null == target) return;
      let e_index = target.e_index,
        scaleRadio = Number(target.scaleX),
        photoItem = that.photo.list[e_index];
      if (that.reachMax) {
        target.animate('top', photoItem.location.position.maxTop, {
          duration: 500,
          onChange: that.canvas.renderAll.bind(that.canvas),
          easing: fabric.util.ease['easeOutBack']
        });
      } else if (that.reachMin) {
        target.animate('top', photoItem.location.position.minTop, {
          duration: 500,
          onChange: that.canvas.renderAll.bind(that.canvas),
          easing: fabric.util.ease['easeOutBack']
        });
      }

    });
  }
}
