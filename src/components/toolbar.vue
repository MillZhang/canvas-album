<template>
  <div class="toolbar">
    <fieldset>
      <legend>基本按钮列表</legend>
      <el-button type="primary" @click="clear">清空</el-button>
      <el-button type="primary" @click="reset">重置</el-button>
      <el-button type="warning" @click="showDialog=true">初始化</el-button>
    </fieldset>
    <fieldset>
      <legend>基本按钮列表</legend>
      <el-button type="primary" round @click="rotateRect">旋转</el-button>
      <el-button type="primary" round @click="imgDialog=true">添加图片</el-button>
    </fieldset>
    <fieldset>
      <legend>图片操作</legend>
      <el-button type="primary" round @click="dealGray">灰度</el-button>
      <el-button type="primary" round @click="addRect">明亮</el-button>
      <el-button type="primary" round @click="rotateRect">反色</el-button>
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
export default {
  data() {
    return {
      form: {
        json: '',
        imageUrl: '',
        index: 0
      },
      rate: 1,
      layout: JSON.parse(localStorage.getItem('layout')),
      showDialog: false,
      imgDialog: false,
      imageList: ['https://images.cache.timepack.cn/o_1bi58kdtv1ovg12f91dqt1l5qn6d15.png',
        'https://images.cache.timepack.cn/o_1bi58kdtv1qgd16ia4vj1k4rfsr17.png',
        'https://images.cache.timepack.cn/o_1bi58kdtv8921l8o3up10itldb16.png',
        'https://images.cache.timepack.cn/o_1bi58kdtv1hmliqeoef1gc82na18.png',
        'https://images.cache.timepack.cn/o_1bi58kdtvjn31sat176b1gqs1qhp1b.png'
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

    handleImageEnsure() {
      if (this.form.imageUrl == '') return;
      this.imgDialog = false;
      this.loadImage(this.form.imageUrl, this.form.index)
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
          img.set({ originX: 'left', originY: 'top' }).scale(this.rate);
          this.canvas.setOverlayImage(img, this.canvas.renderAll.bind(this.canvas));
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
      fabric.Image.fromURL(url, img => {
        console.log(this.layout.area[index].ax * this.rate)
        let oImg = img.set({
          left: this.layout.area[index].ax * this.rate,
          top: this.layout.area[index].ay * this.rate,
          crossOrigin: 'anonymous'
        }).scale(this.rate);
        this.canvas.add(oImg)
      });
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
    applyFilter(filter) {
      let obj = this.canvas.getActiveObject();
      obj.filters[0] = filter;
      obj.applyFilters();
      this.canvas.renderAll();
    },

    dealGray() {
      this.applyFilter(new this.f.Grayscale())
    },

    /**
     * 初始化
     * @return {[type]} [description]
     */
    init() {
      this.f = fabric.Image.filters;
      //1.加载遮罩图
      this.loadLayerImage(this.layout.pngImg).then(() => {
        //2.加载容器
        this.loadArea();
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
