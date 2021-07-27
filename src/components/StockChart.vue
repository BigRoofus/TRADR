<template>
    <v-container class="container">
        <v-row class="row titlebar">
            Press the Next Bar button to advance the chart. Press Buy to buy, or
            Sell to short-sell. Press one of the Flat buttons to close your
            trades.
        </v-row>
        <v-row class="row main">
            <v-col cols="1">
                <highcharts
                    class="stock"
                    :constructor-type="'stockChart'"
                    :options="stockOptions"
                ></highcharts>
            </v-col>

            <v-col cols="1">
                <v-row class="row">
                    <button v-on:click="nextbar()">next bar</button>
                </v-row>
                <v-row class="row">
                    <button v-on:click="trade(400)" class="buybutton">
                        buy
                    </button>
                    <button v-on:click="trade(-400)" class="sellbutton">
                        sell
                    </button>
                </v-row>
                <v-row class="row">
                    <button v-on:click="flat(100)" class="flatbutton">
                        flat
                    </button>
                    <button v-on:click="flat(50)" class="flatbutton">
                        flat ½
                    </button>
                    <button v-on:click="flat(25)" class="flatbutton">
                        flat ¼
                    </button>
                </v-row>
                <v-row class="row">
                    <button v-on:click="reverse()">reverse</button>
                </v-row>
                <v-row class="row">
                    <button v-on:click="replay(9, 333)">replay</button>
                </v-row>
                <v-row class="row flushright">
                    <CogIcon />
                </v-row>
            </v-col>
        </v-row>
        <v-row class="row flushright">
            <h1>&nbsp;{{ total_pl }}</h1>
        </v-row>
        <v-row>
            <ul class="ul">
                <li v-for="i in trade_history" :key="i">{{ i }}</li>
            </ul>
        </v-row>
    </v-container>
</template>

<script>
// TODO
// Modularize code
// Create Trade History panel
// Create Trade Analysis panel
// Set up Firebase DB to save stats, accounts, etc

import { Chart } from 'highcharts-vue'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
import CogIcon from 'vue-material-design-icons/Cog.vue'
import { getpl2 } from '../statics/game-functions.js'

let minute_ohlc = []
let minute_volume = []
let display_period_ohlc = []
let display_period_volume = []
let flags = []

let open_orders = []

let offsethours = 5
let timeoffset = offsethours * 60 * 60 * 1000
let chart_period = 5

const candle_up_color = '#fafafa'
const candle_down_color = '#474747'

// Create number formatter
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)

    // Credit: haykam
    // https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
})

stockInit(Highcharts)

import price_history from '../../price_history/2_MinuteOHLC_3Days.json'

let itime, d
for (let i in price_history['candles']) {
    // Adjust for time offset
    itime = price_history['candles'][i]['datetime']
    itime -= timeoffset

    // Skip this record if pre market or after hours data
    d = new Date(itime)
    if (d.getUTCHours() < 9) continue // < 9am
    if (d.getUTCHours() == 9 && d.getUTCMinutes() < 30) continue // 9am - 9:30am
    if (d.getUTCHours() == 16 && d.getUTCMinutes() > 2) continue // 4:02pm - 5pm
    if (d.getUTCHours() > 16) continue // > 5pm

    // CREATE MINUTE DATA - - - - - - - - - - - - - - - - - - - - - - - - - -
    minute_ohlc.push([
        itime,
        price_history['candles'][i]['open'],
        price_history['candles'][i]['high'],
        price_history['candles'][i]['low'],
        price_history['candles'][i]['close']
    ])

    minute_volume.push([
        itime, //
        price_history['candles'][i]['volume']
    ])

    // CREATE DISPLAY PERIOD DATA - - - - - - - - - - - - - - - - - - - - - -
    if (i % chart_period == 0 && i > 0) {
        let display_period_high = -1
        let display_period_low = 9999999999
        let display_period_vol = 0
        let volume_color

        // Get datetime from initial_chart_ohlc periods ago
        let display_period_datetime =
            price_history['candles'][i - chart_period]['datetime']

        // Adjust for time offset
        display_period_datetime -= timeoffset

        // Get open from initial_chart_ohlc periods ago
        let display_period_open =
            price_history['candles'][i - chart_period]['open']

        // Get close from current period - 1
        let display_period_close = price_history['candles'][i - 1]['close']

        // Get high, low, and volume
        for (let j = chart_period; j > 0; j--) {
            if (price_history['candles'][i - j]['high'] > display_period_high) {
                display_period_high = price_history['candles'][i - j]['high']
            }
            if (price_history['candles'][i - j]['low'] < display_period_low) {
                display_period_low = price_history['candles'][i - j]['low']
            }

            display_period_vol += price_history['candles'][i - j]['volume']
        }

        // Get volume bar color
        if (display_period_close >= display_period_open) {
            volume_color = candle_up_color
        } else {
            volume_color = candle_down_color
        }

        // Push it, push it good
        display_period_ohlc.push({
            x: display_period_datetime,
            open: display_period_open,
            high: display_period_high,
            low: display_period_low,
            close: display_period_close,
            color: volume_color
        })

        display_period_volume.push({
            x: display_period_datetime,
            y: display_period_vol,
            color: volume_color
        })
    }
}

// CREATE INITIAL CHART VIEW DATA - - - - - - - - - - - - - - - - - - - - - -
let initial_chart_ohlc = []
let initial_chart_volume = []
let nav_start, nav_end
let init_chart_length = Math.round(display_period_ohlc.length * 0.66)
let init_nav_length = Math.round(display_period_ohlc.length * 0.05)
let initial_chart_high = -1
let initial_chart_low = 9999999999
let _period_ohlc_atr
let _period_ohlc_atr_sum = 0
let _ohlc_atr
let _period_volume_atr_sum = 0
let _volume_atr
let _bar_count = 0

for (let p in display_period_ohlc) {
    if (p < init_chart_length) {
        // Get Navigtor start(min) time
        if (
            p <
            display_period_ohlc.length - init_chart_length - init_nav_length
        ) {
            nav_start = display_period_ohlc[p].x
            _bar_count += 1

            // Get "atr" of ohlc period data
            _period_ohlc_atr =
                display_period_ohlc[p].high - display_period_ohlc[p].low
            _period_ohlc_atr_sum += _period_ohlc_atr
            _ohlc_atr = _period_ohlc_atr_sum / _bar_count

            // Get "atr" of volume period data
            _period_volume_atr_sum += display_period_volume[p].y
            _volume_atr = _period_volume_atr_sum / _bar_count
        } else {
            // Get high and low for initial chart view
            if (display_period_ohlc[p].high > initial_chart_high)
                initial_chart_high = display_period_ohlc[p].high
            if (display_period_ohlc[p].low < initial_chart_low)
                initial_chart_low = display_period_ohlc[p].low
        }

        initial_chart_ohlc.push({
            x: display_period_ohlc[p].x, // datetime
            open: display_period_ohlc[p].open, // open
            high: display_period_ohlc[p].high, // high
            low: display_period_ohlc[p].low, // low
            close: display_period_ohlc[p].close, // close
            color: display_period_ohlc[p].color // color
        })
        initial_chart_volume.push({
            x: display_period_volume[p].x, // datetime
            y: display_period_volume[p].y, // volume
            color: display_period_volume[p].color // volume color
        })

        // Get Navigtor end(max) time - - - - - - - - - - - - - -
        nav_end = display_period_ohlc[p].x
    }
}

export default {
    props: {
        partsdata: {
            type: Array
        }
    },
    components: {
        highcharts: Chart,
        CogIcon
    },
    methods: {
        getpl() {
            let _chart_ohlc = this.stockOptions.series[0].data
            let _current_close = _chart_ohlc[_chart_ohlc.length - 1].close
            let _total_pl = 0

            if (open_orders.length > 0) {
                for (let i = 0; i <= open_orders.length - 1; i++) {
                    _total_pl +=
                        (_current_close - open_orders[i].enter_price) *
                        open_orders[i].volume
                }
            }

            return formatter.format(_total_pl)
        },
        get_total_mass() {
            let _total_mass = 0

            if (open_orders.length > 0) {
                for (let i = 0; i <= open_orders.length - 1; i++) {
                    _total_mass += open_orders[i].volume
                }
            }

            return _total_mass
        },
        nextbar() {
            let _chart_ohlc = this.stockOptions.series[0].data
            let _chart_yaxis = this.stockOptions.yAxis[0]
            let _ohlc = [...display_period_ohlc]
            let _volume = [...display_period_volume]

            _ohlc.splice(_chart_ohlc.length + 1)
            _volume.splice(this.stockOptions.series[1].data.length + 1)

            // set data
            this.stockOptions.series[0].data = _ohlc
            this.stockOptions.series[1].data = _volume

            // RESET OHLC CHART
            // If high > chart high
            if (
                _chart_ohlc[_chart_ohlc.length - 1].high > _chart_yaxis.max // + spread distance?
            ) {
                this.stockOptions.yAxis[0].min += _ohlc_atr * 3
                this.stockOptions.yAxis[0].max += _ohlc_atr * 3
            }
            // If low < chart low
            if (_chart_ohlc[_chart_ohlc.length - 1].low < _chart_yaxis.min) {
                this.stockOptions.yAxis[0].min -= _ohlc_atr * 3
                this.stockOptions.yAxis[0].max -= _ohlc_atr * 3
            }

            // GET VOLUME ATR?
            this.total_pl = this.getpl()
        },
        trade(_units) {
            let _chart_ohlc = this.stockOptions.series[0].data
            let _current_close = _chart_ohlc[_chart_ohlc.length - 1].close

            // Paint dot
            let _color = 'rgba(255, 0, 0, 0.65)'
            if (_units > 0) {
                _color = 'rgba(124, 252, 0, 0.8)'
            }
            this.stockOptions.series[2].data.push({
                x: _chart_ohlc[_chart_ohlc.length - 1].x,
                title: ' ',
                fillColor: _color,
                color: _color
            })

            // Make trade
            open_orders.push({
                volume: _units,
                enter_price: _current_close
            })

            this.total_pl = this.getpl()
        },
        flat(_percent) {
            if (open_orders.length > 0) {
                let _chart_ohlc = this.stockOptions.series[0].data
                let _current_close = _chart_ohlc[_chart_ohlc.length - 1].close
                let _mass_to_flat = this.get_total_mass()

                // Bracketing
                if (_percent > 100) {
                    _percent = 100
                }
                if (_percent < 0) {
                    _percent = 0
                }
                _percent *= 0.01

                // Calc num of units to flat
                _mass_to_flat *= _percent

                let _flat_pl = 0

                for (let i = open_orders.length - 1; i >= 0; i--) {
                    // If volume to flat > newest order
                    if (_mass_to_flat >= open_orders[i].volume) {
                        // Subtract this trade's volume from _mass_to_flat
                        _mass_to_flat -= open_orders[i].volume

                        //calc pl
                        _flat_pl =
                            (_current_close - open_orders[i].enter_price) *
                            open_orders[i].volume

                        // Remove this trade
                        open_orders.splice(i, 1)

                        // Paint blue dot
                        this.stockOptions.series[2].data.push({
                            x: _chart_ohlc[_chart_ohlc.length - 1].x,
                            title: ' ',
                            fillColor: 'rgba(25, 25, 112, 0.65)',
                            color: 'rgba(25, 25, 112, 0.65)'
                        })

                        // Publish trade
                        this.trade_history.unshift(formatter.format(_flat_pl))

                        if (_mass_to_flat <= 0) {
                            break
                        }
                    }
                    // If volume to flat < newest order
                    if (_mass_to_flat < open_orders[i].volume) {
                        // Subtract _mass_to_flat from this trade's volume
                        open_orders[i].volume -= _mass_to_flat

                        //calc pl
                        _flat_pl =
                            (_current_close - open_orders[i].enter_price) *
                            _mass_to_flat

                        // Paint blue dot
                        this.stockOptions.series[2].data.push({
                            x: _chart_ohlc[_chart_ohlc.length - 1].x,
                            title: ' ',
                            fillColor: 'rgba(25, 25, 112, 0.65)',
                            color: 'rgba(25, 25, 112, 0.65)'
                        })

                        // Publish trade
                        this.trade_history.unshift(formatter.format(_flat_pl))
                        break
                    }
                }

                this.total_pl = this.getpl()
            }
        },
        reverse() {
            if (open_orders.length > 0) {
                // sum weight of all open orders
                let _total_mass = this.get_total_mass()

                // Close all
                this.flat(100)

                // Open reverse trade
                if (_total_mass > 0) {
                    this.trade(_total_mass * -1)
                }
                if (_total_mass < 0) {
                    this.trade(_total_mass * -1)
                }

                this.total_pl = this.getpl()
            }
        },
        replay(periods, time_per_bar) {
            let _ohlc = [...display_period_ohlc]
            let _volume = [...display_period_volume]
            _ohlc.splice(this.stockOptions.series[0].data.length - periods)
            _volume.splice(this.stockOptions.series[1].data.length - periods)
            this.stockOptions.series[0].data = _ohlc
            this.stockOptions.series[1].data = _volume

            let animateId = setInterval(() => {
                if (periods == 0) {
                    animateId = clearInterval(animateId) // Stop loop
                } else {
                    periods--
                    _ohlc = [...display_period_ohlc]
                    _volume = [...display_period_volume]
                    _ohlc.splice(this.stockOptions.series[0].data.length + 1)
                    _volume.splice(this.stockOptions.series[1].data.length + 1)
                    this.stockOptions.series[0].data = _ohlc
                    this.stockOptions.series[1].data = _volume
                }
            }, time_per_bar)
        }
    },
    data() {
        return {
            total_pl: 0,
            trade_history: [],

            // ------------------------------------------------------------------------------------------------------------ //
            // ------- CHART PARAMETERS ----------------------------------------------------------------------------------- //
            // NOTE:  All "line" options are for drawing lines from
            // the opening of a trade to the closeing of a trade.
            // I may not use this option.

            stockOptions: {
                chart: {
                    animation: false,
                    backgroundColor: 'transparent'
                },
                plotOptions: {
                    series: {
                        pointPadding: 1,
                        pointWidth: 4.1,
                        animation: false,
                        dataGrouping: {
                            enabled: false
                        },
                        states: {
                            hover: {
                                enabled: false
                            }
                        },
                        enableMouseTracking: false
                    },
                    candlestick: {
                        lineColor: candle_down_color
                        // upLineColor: candle_up_color
                    }
                },
                xAxis: [
                    // Candlestick Chart
                    {
                        overscroll: 5 * 5 * 60 * 1000, // 5 x 5 minute bars
                        tickWidth: 0,
                        visible: false,
                        crosshair: {
                            enabled: true,
                            snap: false,
                            label: {
                                enabled: true,
                                format: '{value:%l:%M}'
                            }
                        },
                        min: nav_start,
                        max: nav_end
                    },
                    // Volume Chart
                    {
                        tickWidth: 0,
                        visible: false,
                        crosshair: false
                    },
                    // Flag Chart
                    {
                        tickWidth: 0,
                        visible: false,
                        lineWidth: 1,
                        offset: 0,
                        opposite: !0,
                        linkedTo: 0
                    }
                    // // Line?
                    // {
                    // 	tickWidth: 0,
                    // 	// lineColor: s.gridLineColor,
                    // 	// gridLineColor: s.gridLineColor2,
                    // 	lineWidth: 1,
                    // 	offset: -270,
                    // 	opposite: !0,
                    // 	linkedTo: 1,
                    // 	// labels: { style: { color: s.font }, enabled: !1 },
                    // },
                ],
                yAxis: [
                    // Candlestick Chart
                    {
                        visible: false,
                        height: '85%',
                        crosshair: {
                            enabled: true,
                            snap: false,
                            label: {
                                enabled: true,
                                format: '{value:.2f}'
                            }
                        },
                        min: initial_chart_low,
                        max: initial_chart_high
                    },
                    // Volume Chart
                    {
                        visible: false,
                        crosshair: false,
                        top: '69%',
                        height: '45%',
                        max: _volume_atr * 6
                        // offset: 0,
                    },

                    // Flag Chart
                    {
                        visible: false,
                        height: 200,
                        lineWidth: 2,
                        offset: 0,
                        opposite: !0,
                        linkedTo: 0
                    }

                    // // Line?
                    // {
                    // 	// lineColor: s.gridLineColor,
                    // 	// gridLineColor: s.gridLineColor2,
                    // 	startOnTick: !0,
                    // 	// gridLineDashStyle: s.grid,
                    // 	endOnTick: !0,
                    // 	top: 245, // r ? 195 : 320,
                    // 	height: 85, // r ? 75 : 100,
                    // 	lineWidth: 2, // r ? 1 : 2,
                    // 	offset: 0,
                    // 	// labels: { align: "left", x: 5, style: { fontSize: r ? "8px" : "11px", color: s.font } },
                    // 	opposite: !0,
                    // 	linkedTo: 2,
                    // },
                ],
                series: [
                    {
                        type: 'candlestick',
                        data: initial_chart_ohlc,
                        cropThreshold: 0,
                        id: 'candlesticks',
                        name: 'candlesticks'
                    },
                    {
                        yAxis: 1,
                        type: 'column',
                        cropThreshold: 0,
                        data: initial_chart_volume
                    },
                    {
                        type: 'flags',
                        name: 'flags',
                        cropThreshold: 0,
                        shape: 'circlepin',
                        data: flags,
                        onSeries: 'candlesticks',
                        stackDistance: 15,
                        y: -7,
                        width: 10,
                        height: 10
                    }

                    // { // Line?
                    // 	type: "line",
                    // 	connectNulls: !1,
                    // 	name: "flag lines",
                    // 	data: [],
                    // 	yAxis: 0,
                    // 	style: { color: "green" },
                    // 	// dataGrouping: { units: [] },
                    // },

                    // {
                    // 	type: "line",
                    // 	connectNulls: !1,
                    // 	name: "flag lines",
                    // 	data: [],
                    // 	yAxis: 0,
                    // 	style: { color: "red" },
                    // 	// dataGrouping: { units: [] },
                    // },
                ],

                navigator: {
                    maskFill: '#d0dae6',
                    xAxis: {
                        visible: false
                    },
                    margin: 48,
                    height: 53,
                    series: {
                        fillOpacity: 0,
                        lineWidth: 0
                    }
                },
                scrollbar: {
                    height: 0,
                    barBorderWidth: 0
                },
                rangeSelector: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                }
            }
        }
    }
}
</script>
<style scoped>
.titlebar {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #d0dae6;
    flex: 1;
    height: 50px;
}
.main {
    margin-top: 100px;
}
button {
    outline: none;
    background: #828ea0;
    color: #fff;
    font-size: 16px;
    margin: 5px;
    border: 0px;
    padding: 30px;
    flex: 1;
}
button:hover {
    background: #a7aeb8;
    transition: background 0.2s;
}
button:active {
    color: rgb(117, 117, 117);
}
.btnActive {
    color: #6fcd98;
}
.flatbutton {
    background-color: midnightblue;
}
.stock {
    width: 100%;
    margin: 0 auto;
}
.buybutton {
    background-color: green;
}
.sellbutton {
    background-color: red;
}
.flushright {
    justify-content: flex-end;
}
</style>
