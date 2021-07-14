<template>
    <div id="app">
        <keep-alive>
            <component :is="currentView"></component>
        </keep-alive>
    </div>
</template>

<script>
import StockChart from './components/StockChart'

export default {
    name: 'app',
    data() {
        return {
            selected: 'stockChart',
            currentView: 'stockChart'
        }
    },
    components: {
        stockChart: StockChart
    },
    methods: {
        activate(elem) {
            this.selected = elem
        },
        handler() {
            var args = arguments
            for (var arg of args) {
                if (arg instanceof Function) {
                    arg()
                }
            }
        },
        select(elem) {
            this.currentView = elem
            this.activate(elem)
        }
    }
}
</script>

<style>
body {
    background-color: #e6e6e6;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0 auto;
    width: 100%;
}

h1,
h2 {
    font-weight: normal;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}

ul {
    display: flex;
    flex-direction: column;
    list-style-type: none;
    line-height: 30px;
}

.row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}
.row > * {
    padding: 0 20px;
}
.logos {
    margin: 0 auto;
    width: 50%;
}
.logo-hc {
    width: 70%;
    height: auto;
}
.logo-vue {
    width: 15%;
    height: auto;
}
.button-grp {
    margin: 20px 0;
}
</style>
