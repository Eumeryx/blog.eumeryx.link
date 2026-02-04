<template>
    <div>Games</div>
    <canvas ref="canvasRef" width="640" height="480"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {RLE} from '../../../life_algo/pattern'
import {LazyLife} from '../../../life_algo/lazy_life'
import { Point } from "../../../life_algo/common";



const test = `#N Gosper glider gun_synth
#O Bill Gosper
#C Glider synthesis of Gosper glider gun.
#C www.conwaylife.com/wiki/index.php?title=Gosper_glider_gun
x = 47, y = 14, rule = b3/s23
16bo30b$16bobo16bo11b$16b2o17bobo9b$obo10bo21b2o10b$b2o11b2o31b$bo11b
2o32b3$10b2o20b2o13b$11b2o19bobo9b3o$10bo21bo11bo2b$27bo17bob$27b2o18b
$26bobo!`

const cells = RLE.fromString(test).aliveCells

const canvasRef = ref<HTMLCanvasElement>()

onMounted(() => {
    const ctx = canvasRef.value!.getContext('2d', { alpha: false })!

    ctx.fillStyle = 'red'
    // ctx.fillRect(0, 0, 150, 150)

    const life = new LazyLife(50, 30)

    // for (let x = 1; x+=1; x < 50) {
    //     // console.log(x)
        ctx.moveTo(10, 0)
        ctx.lineTo(10, 30)
        
    // }

    ctx.stroke()

    
    for (const {x, y} of cells) {
        ctx.fillRect(x * 11, y * 11, 10, 10)
        life.setCall(new Point(x, y), true)
    }

    setInterval(() => {
        life.tick()

        for (const {point, state} of life.diffCellList) {
            const {x, y} = point

            if (state) {
                ctx.fillRect(x * 11, y * 11, 10, 10)
            } else {
                ctx.clearRect(x * 11, y * 11, 10, 10)
            }


        if (x >= 48 || y >= 29)
            console.log(x, y)
        }
    }, 50)
})
</script>