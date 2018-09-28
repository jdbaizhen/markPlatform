<template>
    <div>
        <div class="go-top" @click="goTop"><i class="el-icon-arrow-up"></i></div>
        <div class="footer">Copyright © 丰华联合科技有限公司 Inc. 2018</div>
    </div> 
</template>

<script>
export default {
    data() {
        return {}
    },
    methods: {
        goTop() {
            window.scrollTo( 0, 0 );
        }
    }
}
</script>

<style>
.go-top{
    position: fixed;
    bottom: 80px;
    left: 30px;
    width: 50px;
    height: 50px;
    line-height: 50px;
    border: 1px solid #ccc;
    background: rgba(9, 194, 201, 0.3);
    text-align: center;
    border-radius: 8px;
    color: #fff;
    z-index: 9999;
}
.go-top:hover{
    cursor: pointer;
}
.footer{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-top: 1px solid #ccc;
    color: #fff;
    background: rgba(9, 194, 201, 0.7);
}
</style>
