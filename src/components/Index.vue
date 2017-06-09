<template>
  <div class="index">
    <main class="main">
      <canvas id="canvas"></canvas>
    </main>
  </div>
</template>
<script>
import 'fabric'
import Editor from '@/assets/editor'
export default {
  name: 'index',
  data() {
    return {
      containWidth: window.innerWidth * 0.8,
      aspectRadio: 1
    }
  },
  mounted() {
    this.$nextTick(() => {
      let canvasObj = document.getElementById('canvas');
      canvasObj.width = this.containWidth;
      canvasObj.height = this.containWidth * this.aspectRadio;
      this.canvas = new fabric.Canvas('canvas');
    });

  }
}
</script>
<style scoped lang="scss">
.main {
  margin: 10% auto 0;
  width: 80%;
  canvas {
    border: 1px solid #bc223d;
  }
}
</style>
