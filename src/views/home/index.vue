<template>
  <div class="gdp-login-container">
    <canvas id="canvas"></canvas>
    <div class="gdp-header">
      <div class="gdp-title">通用存证平台</div>
      <ul @click="changeTemplate">
        <li id="Login">登录</li>
      </ul>
    </div>
    <component :is="comName"></component>
  </div>
</template>

<script>
import { random } from "@/util/util";
import Login from "@/views/home/login/login.vue";
export default {
  name: "Home",

  components: {
    Login,
  },

  data() {
    return {
      // canvas动画
      canvas1: null,
      canvas2: null,
      ctx1: null,
      ctx2: null,
      w: 0,
      h: 0,
      hue: 217,
      stars: [], // 星星数据集
      maxStars: 2000, // 星星数量

      // 组件名称
      comName: "",
    };
  },

  mounted() {
    this.initCanvas();
    this.initStars();
    this.animation();
  },

  methods: {
    // 切换初始页内容
    changeTemplate(e) {
      this.comName = e.target.id;
    },

    // 画布初始化
    initCanvas() {
      this.canvas1 = document.getElementById("canvas");
      (this.ctx1 = this.canvas1.getContext("2d")),
        (this.w = this.canvas1.width = window.innerWidth);
      this.h = this.canvas1.height = window.innerHeight;

      this.canvas2 = document.createElement("canvas");
      this.ctx2 = this.canvas2.getContext("2d");
      this.canvas2.width = 100;
      this.canvas2.height = 100;
      let half = this.canvas2.width / 2;
      let gradient = this.ctx2.createRadialGradient(
        half,
        half,
        0,
        half,
        half,
        half
      );
      gradient.addColorStop(0.025, "#CCC");
      gradient.addColorStop(0.1, "hsl(" + this.hue + ", 61%, 33%)");
      gradient.addColorStop(0.25, "hsl(" + this.hue + ", 64%, 6%)");
      gradient.addColorStop(1, "transparent");
      this.ctx2.fillStyle = gradient;
      this.ctx2.beginPath();
      this.ctx2.arc(half, half, half, 0, Math.PI * 2);
      this.ctx2.fill();
    },
    // 初始化画布星星
    initStars() {
      for (let i = 0, count = 0; i < this.maxStars; i++) {
        let orbitRadius = random(this.maxOrbit(this.w, this.h));
        let star = {
          orbitRadius: orbitRadius,
          radius: random(60, orbitRadius) / 18,
          orbitX: this.w / 2,
          orbitY: this.h / 2,
          timePassed: random(0, this.maxStars),
          speed: random(orbitRadius) / 500000,
          alpha: random(2, 10) / 10,
        };
        count++;
        this.stars[count] = star;
      }
    },
    // 绘制星星
    drawStar(star) {
      let x = Math.sin(star.timePassed) * star.orbitRadius + star.orbitX,
        y = Math.cos(star.timePassed) * star.orbitRadius + star.orbitY,
        twinkle = random(10);
      if (twinkle === 1 && star.alpha > 0) {
        star.alpha -= 0.05;
      } else if (twinkle === 2 && star.alpha < 1) {
        star.alpha += 0.05;
      }

      this.ctx1.globalAlpha = star.alpha;
      this.ctx1.drawImage(
        this.canvas2,
        x - star.radius / 2,
        y - star.radius / 2,
        star.radius,
        star.radius
      );
      star.timePassed += star.speed;
    },
    // 画布星星移动范围,值越大范围越小
    maxOrbit(x, y) {
      let max = Math.max(x, y),
        diameter = Math.round(Math.sqrt(max * max + max * max));
      return diameter / 2;
    },
    // 画布动画
    animation() {
      this.ctx1.globalCompositeOperation = "source-over";
      this.ctx1.globalAlpha = 0.5;
      this.ctx1.fillStyle = "hsla(" + this.hue + ", 64%, 6%, 2)";
      this.ctx1.fillRect(0, 0, this.w, this.h);
      this.ctx1.globalCompositeOperation = "lighter";

      for (let i = 1; i < this.stars.length; i++) {
        this.drawStar(this.stars[i]);
      }
      window.requestAnimationFrame(this.animation);
    },
  },
};
</script>

<style lang="less" scoped>
.gdp-login-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #070c14;
  overflow: hidden;

  .gdp-header {
    width: 100%;
    height: 60px;
    background-color: #3f3f3f;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;

    .gdp-title {
      width: 200px;
      height: 100%;
      background-color: #979797;
      line-height: 60px;
      font-size: 20px;
      font-weight: bolder;
      text-align: center;
      color: #f5f5f5;
      font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
    }

    ul {
      height: 100%;
      display: flex;
      font-size: 20px;
      line-height: 60px;
      margin-right: 30px;
      font-weight: bold;
      color: #fff;

      li {
        height: 100%;
        line-height: 60px;
        padding-left: 15px;
        padding-right: 15px;
        cursor: pointer;

        &:hover {
          color: wheat;
        }
      }
    }
  }
}
</style>