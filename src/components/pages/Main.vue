<template>
    <div>
        <el-container>
            <el-header class="nav-header">
                <Navbar></Navbar>
            </el-header>
            <el-main class="mains">
                <router-view></router-view>
            </el-main>
            <el-footer>
                <Footer></Footer>
            </el-footer>
        </el-container>
        
        
    </div>
</template>

<script>
import Navbar from '@/components/component/Navbar'
import Footer from '@/components/component/Footer'
export default {
    data () {
        return {

        }
    },
    components: {
        Navbar,
        Footer
    }
}
</script>

<style>

</style>
