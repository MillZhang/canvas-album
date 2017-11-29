<template>
  <div class="toolbar">
    <fieldset>
      <legend>基本按钮列表</legend>
      <el-row>
        <el-button type="warning" @click="showDialog=true">初始化</el-button>
        <el-button type="success" @click="handleExport">导出</el-button>
      </el-row>
      <el-row>
        <el-button @click="clear">清空</el-button>
        <el-button type="info" @click="reset">重置</el-button>
        <el-button type="danger" @click="deleteObj">删除</el-button>
      </el-row>
    </fieldset>
    <fieldset>
      <legend>基本按钮列表</legend>
      <el-button type="primary" round @click="rotateRect">旋转</el-button>
      <el-button type="primary" round @click="imgDialog=true">添加图片</el-button>
    </fieldset>
    <fieldset>
      <legend>图片操作</legend>
      <el-checkbox-group v-model="selectedFilterList">
        <el-row v-for="(item,index) in filters" :key="item.index">
          <el-col :span="10" style="margin: 9px 0;">
            <el-checkbox :label="item.index" @change="handleFilterSelect(index)">{{item.cname}}({{item.name}})</el-checkbox>
          </el-col>
          <el-col :span="14">
            <el-slider :min="item.min" :max="item.max" :step="item.step" v-model="filters[index].value" @change="(value)=>handleFilterValueChange(value,index)" v-if="item.slider"></el-slider>
          </el-col>
        </el-row>
      </el-checkbox-group>
    </fieldset>
    <el-dialog title="配置信息" :visible.sync="showDialog" width="40%" center>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="json:">
          <el-input type="textarea" v-model="form.json" :autosize="{ minRows: 10, maxRows: 10}"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleEnsure">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加图片" :visible.sync="imgDialog" width="40%" center>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="图片地址:">
          <el-input v-model="form.imageUrl"></el-input>
        </el-form-item>
        <el-form-item label="图片下标:">
          <el-input v-model="form.index"></el-input>
        </el-form-item>
        <el-tag type="warning">你也可以选择以下图片：</el-tag>
        <el-row style="margin-top: 12px;">
          <el-radio-group v-model="form.imageUrl">
            <template v-for="(item,index) in imageList">
              <el-col :span="6">
                <el-radio :label="item">
                  <img :src="item+'?imageView2/1/w/100/h/100/q/100'" alt="">
                </el-radio>
              </el-col>
            </template>
          </el-radio-group>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="imgDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleImageEnsure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Loading from 'element-ui'
import filters from '../assets/filter.js'
export default {
  data() {
    return {
      form: {
        json: '',
        imageUrl: '',
        index: 0
      },
      selectedFilterList: [],
      filters: filters,
      rate: 1,
      layout: JSON.parse(localStorage.getItem('layout')),
      showDialog: false,
      imgDialog: false,
      imageList: ['https://images.cache.timepack.cn/o_1bi58kdtv1ovg12f91dqt1l5qn6d15.png',
        'https://images.cache.timepack.cn/o_1bi58kdtv1qgd16ia4vj1k4rfsr17.png',
        'https://images.cache.timepack.cn/o_1bi58kdtv8921l8o3up10itldb16.png',
        'https://images.cache.timepack.cn/o_1bi58kdtv1hmliqeoef1gc82na18.png',
        'https://images.cache.timepack.cn/o_1bi58kdtvjn31sat176b1gqs1qhp1b.png',
        'https://images.cache.timepack.cn/o_1bi58kdtv14so3731r271tj114la1d.png'
      ]
    }
  },
  props: {
    canvas: {
      default: null,
      required: true
    }
  },
  created() {
    if (null != this.layout) {
      this.init();
    }
  },
  methods: {
    clear() {
      localStorage.removeItem('layout');
      this.canvas.clear();
    },
    reset() {
      this.canvas.clear();
      this.init();
    },
    deleteObj() {
      let activeObj = this.canvas.getActiveObject();
      if (null == activeObj) {
        this.$message(`请选择对象`)
        return;
      }
      this.canvas.remove(activeObj)
    },
    addRect() {
      let rect = new fabric.Rect({
        left: 150,
        top: 150,
        fill: '#bc223d',
        width: 200,
        height: 200
      })
      this.canvas.add(rect);
    },
    rotateRect() {
      let activeObj = this.canvas.getActiveObject();
      if (null == activeObj) {
        this.$message(`请选择对象`)
        return;
      }
      activeObj.animate('angle', activeObj.angle + 360, {
        duration: 1000,
        onChange: this.canvas.renderAll.bind(this.canvas),
        easing: fabric.util.ease.ease
      });
    },

    layerImage() {
      if (null != this.canvas.overlayImage) return;
      this.loadLayerImage(this.layerUrl);
    },

    handleEnsure() {
      if ('' == this.form.json) return;
      this.showDialog = false;
      try {
        this.layout = JSON.parse(this.form.json);
        localStorage.setItem('layout', JSON.stringify(this.layout))
        this.init();
      } catch (e) {
        this.$message('json解析错误');
        return;
      }

    },

    handleExport() {
      var dataURL = this.canvas.toDataURL('png');
    },

    handleImageEnsure() {
      if (this.form.imageUrl == '') return;
      this.imgDialog = false;
      this.loadImage(this.form.imageUrl, this.form.index)
    },

    /**
     * 滤镜选项选择
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    handleFilterSelect(index) {
      let model = null;
      if (this.selectedFilterList.indexOf(index) > -1) {
        model = this.getFilterModel(index);
      }
      this.applyFilter(index, model);
    },

    /**
     * 滤镜值变化
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    handleFilterValueChange(value, index) {
      var obj = this.canvas.getActiveObject();
      if (this.selectedFilterList.indexOf(index) > -1) {
        let prop = this.filters[index].name;
        obj.filters[index][prop] = value;
        obj.applyFilters();
      }
      this.canvas.renderAll();
    },

    getFilterModel(index) {
      let model = null,
        f = fabric.Image.filters;
      switch (index) {
        case 0:
          model = new f.Grayscale();
          break;
        case 1:
          model = new f.Invert();
          break;
        case 2:
          model = new f.Sepia();
          break;
        case 3:
          model = new f.Brownie();
          break;
        case 4:
          model = new f.Brightness();
          break;
        case 5:
          model = new f.Noise();
          break;
        case 6:
          model = new f.Blur();
          break;
        case 7:
          model = new f.Convolute({
            matrix: [0, -1, 0, -1, 5, -1,
              0, -1, 0
            ]
          });
          break;
        case 8:
          model = new f.Convolute({
            matrix: [1, 1, 1,
              1, 0.7, -1, -1, -1, -1
            ]
          });
          break;
        case 9:
          model = new f.BlackWhite();
          break;
        case 10:
          model = new f.Technicolor();
          break;
        case 11:
          model = new f.Polaroid();
          break;
        default:
          break;
      }
      return model;
    },



    /**
     * 加载遮罩层
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    loadLayerImage(url) {
      return new Promise((resolve, reject) => {
        fabric.Image.fromURL(url, img => {
          this.rate = Number(1 / (img.getOriginalSize().width / this.canvas.width)).toFixed(5);
          img.set({ originX: 'left', originY: 'top', crossOrigin: 'anonymous' }).scale(this.rate);
          this.canvas.setOverlayImage(img, this.canvas.renderAll.bind(this.canvas), {
            crossOrigin: 'Anonymous'
          });
          resolve();
        });
      })
    },

    /**
     * 加载图片
     * @param  {[type]} url   [description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    loadImage(url, index) {
      fabric.util.loadImage(url, image => {
        let img = new fabric.Image(image),
          imgOriginalSize = img.getOriginalSize(),
          imgRadio = imgOriginalSize.width / imgOriginalSize.height;
        let area = this.layout.area[index],
          areaRadio = area.aw / area.ah;
        let scale = 1,
          lockMovementX = true,
          lockMovementY = true,
          direction = 0, //默认水平
          dragLimit = {};
        if (areaRadio >= imgRadio) {
          scale = (area.aw * this.rate) / imgOriginalSize.width;
          lockMovementY = false;
          direction = 1;
          dragLimit.maxTop = area.ay * this.rate;
          dragLimit.minTop = Number((dragLimit.maxTop + (area.ah * this.rate - imgOriginalSize.height * scale)).toFixed(5));
        } else {
          scale = (area.ah * this.rate) / imgOriginalSize.height;
          lockMovementX = false;
          dragLimit.maxLeft = area.ax * this.rate;
          dragLimit.minLeft = Number((dragLimit.maxLeft + (area.aw * this.rate - imgOriginalSize.width * scale)).toFixed(5));
        }
        let oImg = img.set({
          left: area.ax * this.rate,
          top: area.ay * this.rate,
          lockMovementX: lockMovementX,
          lockMovementY: lockMovementY,
          dragLimit: dragLimit,
          area: area,
          direction: direction,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true,
          hasControls: false,
          hasBorders: false
        }).scale(scale);
        this.canvas.add(oImg)
      }, null, { crossOrigin: 'Anonymous' });
    },

    /**
     * 加载容器区域
     * @return {[type]} [description]
     */
    loadArea() {
      let area = this.layout.area;
      area.forEach((item, index) => {
        let rect = new fabric.Rect({
          width: item.aw * this.rate,
          height: item.ah * this.rate,
          left: item.ax * this.rate,
          top: item.ay * this.rate,
          fill: '#bc223d',
          selectable: false
        })
        this.canvas.add(rect);
      });
    },

    /**
     * 应用滤镜选项
     * @param  {[type]} filter [description]
     * @return {[type]}        [description]
     */
    applyFilter(index, filter) {
      let obj = this.canvas.getActiveObject();
      if (null == obj) return;
      obj.filters[index] = filter;
      obj.applyFilters();
      this.canvas.renderAll();
    },

    dealGray() {
      this.applyFilter(new fabric.Image.filters.Grayscale())
    },

    /**
     * 初始化
     * @return {[type]} [description]
     */
    init() {
      //1.加载遮罩图
      this.loadLayerImage(this.layout.pngImg).then(() => {
        //2.加载容器
        this.loadArea();
        this.addEventListener();
      });
    },

    /**
     * 添加事件监听
     */
    addEventListener() {
      this.onMouseMoving();
      this.onMouseUp();
    },

    onMouseMoving() {
      this.canvas.on('object:moving', e => {
        // this.limitCompute(e, 'moving', 20)
      });
    },

    onMouseUp() {
      this.canvas.on('mouse:up', e => {
        this.limitCompute(e, 'mouseup', 0)
      });
    },

    limitCompute(e, type, offset) {
      let target = e.target,
        area = target.area,
        limit = target.dragLimit;
      fabric.log(`moving==>left:${target.left},top:${target.top};limit==>${JSON.stringify(target.dragLimit)}`)
      if (target.direction == 1) {
        let areaTop = area.ay * this.rate;
        if ((target.top + offset) > limit.maxTop) {
          type == 'moving' ? target.lockMovementY = true : this.resetPosition(target, 'top', limit.maxTop)
        } else if ((target.top - offset) < limit.minTop) {
          type == 'moving' ? target.lockMovementY = true : this.resetPosition(target, 'top', limit.minTop)
        }
      } else if (target.direction == 0) {
        let areaLeft = area.ax * this.rate;
        if ((target.left + offset) > limit.maxLeft) {
          type == 'moving' ? target.lockMovementX = true : this.resetPosition(target, 'left', limit.maxLeft)
        } else if ((target.left - offset) < limit.minLeft) {
          type == 'moving' ? target.lockMovementX = true : this.resetPosition(target, 'left', limit.minLeft)
        }
      }
    },

    /**
     * 拖拽重置拖拽位置
     * @param  {[type]} target [description]
     * @param  {[type]} type   [description]
     * @param  {[type]} pos    [description]
     * @return {[type]}        [description]
     */
    resetPosition(target, type, pos) {
      target.animate(type, pos, {
        duration: 200,
        onChange: this.canvas.renderAll.bind(this.canvas),
        easing: fabric.util.ease.ease
      });
    }
  }
}

</script>
<style lang="scss" scoped>
.toolbar {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  border-left: 1px solid #aaa;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-button:vertical {
    display: none
  }

  &::-webkit-scrollbar-corner,
  &::-webkit-scrollbar-track {
    background-color: #e2e2e2
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 0;
    background-color: rgba(0, 0, 0, .3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:vertical:hover {
    background-color: rgba(0, 0, 0, .35)
  }

  &::-webkit-scrollbar-thumb:vertical:active {
    background-color: rgba(0, 0, 0, .38)
  }
  .title {
    width: 100%;
    text-align: center;
    height: 40px;
    line-height: 40px;
  }
}

.el-button {
  margin: 5px;
}

</style>
