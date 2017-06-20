<template>
  <div class="index">
    <main class="main">
      <canvas id="canvas"></canvas>
    </main>
  </div>
</template>
<script>
import Editor from '@/assets/editor'
export default {
  name: 'index',
  data() {
    return {
      containWidth: window.innerWidth * 0.8,
      aspectRadio: 1,
      layout: {
        id: 1091,
        layoutStyle: {
          main: 1,
          sub: 22
        },
        tw: 1752,
        th: 1811,
        area: [{
          aw: 1004,
          ah: 714,
          ax: 458,
          ay: 494
        }],
        pngImg: "http://image.cache.timepack.cn/o_1bhjbtd4r10u2k46l2u7qg1jhm1p.png",
        scale: 1
      },
      photo: {
        "list": [{
          "width": "2448",
          "height": "3264",
          "key": "o_1bhjcmqu81ocd15r2i0r19ckujt2e.jpg",
          "degree": "90",
          "location": {
            "position": {
              "maxTop": 0,
              "minTop": -182.55,
              "left": 0,
              "top": -91.28
            },
            "layoutIndex": 1
          }
        }],
        "size": 1,
        "main": 1,
        "sub": 22,
        "temp": 1091,
        "wait": 1,
        "bw": 512,
        "dpr": "2"
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      new Editor('canvas', this.containWidth, this.layout, this.photo)
    });
  },
  methods: {}
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
