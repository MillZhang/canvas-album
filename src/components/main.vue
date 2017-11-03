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
      canvasObj.width = this.$refs.container.style.width;
      canvasObj.height = this.$refs.container.style.width;
      this.canvas = new fabric.Canvas('canvas');
      console.log(this.canvas)
      this.canvas.selection = false;
    }
  },
  mounted() {
    this.init();
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
