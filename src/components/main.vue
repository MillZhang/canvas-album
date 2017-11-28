<template>
  <div class="main-box" ref="container">
    <canvas id="canvas"></canvas>
  </div>
</template>
<script>
import 'fabric'
export default {
  data() {
    return {

    }
  },
  created() {

  },
  methods: {
    init() {
      let canvasObj = document.getElementById('canvas');
      let w = this.$refs.container.offsetWidth;
      canvasObj.width = window.innerHeight;
      canvasObj.height = window.innerHeight;
      this.canvas = new fabric.Canvas('canvas');
      this.$emit('loaded', this.canvas)
    },
    addRect() {
      let rect = new fabric.Rect({
        left: 150,
        top: 150,
        fill: 'red',
        width: 200,
        height: 200
      })
      this.canvas.add(rect);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  }
}

</script>
<style scoped>
.main-box {
  width: 100%;
  height: 100%;
  box-shadow: 0 0 5px #878d99;
}

</style>
