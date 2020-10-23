
var traceSource = {
    methods: {
        init() {
            $('.pic02').on("click", traceSource.events.hide)
            $("#select").on("change", traceSource.events.select)
        },
    },
    events: {
        load() {
            var barcode = traceSource.events.GetQueryString("Barcode") || traceSource.events.GetQueryString('barcode');
            console.log("br:", barcode)
            if (barcode) {
                traceSource.events.getlivestock(barcode)
            }
            $.datepicker.regional["zh-CN"] = { closeText: "关闭", prevText: "&#x3c;上月", nextText: "下月&#x3e;", currentText: "今天", monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], monthNamesShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"], dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"], dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"], weekHeader: "周", dateFormat: "yy-mm-dd", firstDay: 1, isRTL: !1, showMonthAfterYear: !0, yearSuffix: "年" }
            $.datepicker.setDefaults($.datepicker.regional["zh-CN"]);
            $("#datepicker").datepicker({
                onSelect: traceSource.events.gotoDate,
                format: "yyyy-mm-dd"
            });
        },
        getlivestock(barcode) {
            $.ajax({
                type: 'GET',
                url: 'https://ynyiot.com/api/no-auth/tracing',
                dataType: 'json',
                data: {
                    chipNo: barcode
                },
                headers: { "content-type": "application/x-www-form-urlencoded" },
                success: res => {
                    const data = res.data;
                    if (res.code == "200") {
                        $('.farmName').html(`<span>基地名称：</span>${data.farmName}`)
                        $('.farmAddress').html(`<span>具体位置：</span>${data.farmAddress}`)
                        $('.farmCords').html(`<span>经 纬 度 ：</span>东经${data.coords.split(',')[0]}/北纬${data.coords.split(',')[1]}`)
                        $('.livestock').html(`
                      <p><span>产品品种：</span>${data.varName}</p>
                      <p><span>产品性别：</span>${data.sex == '0' ? '母鸡' : '公鸡'}</p>
                      <p><span>累计步数：</span>${data.stepCount}</p>
                      <p><span>批 次 号 ：</span>${data.batchNo}</p>
                      <p><span>入栏时间：</span>${data.lairageTime}</p>
                      <p><span>养殖天数：</span>${data.breedDays}/天</p>
                    `)
                        for (let i = 0; i < data.cameras.length; i++) {
                            $('#select').append(`<option value="${data.cameras[i].serial}">${data.cameras[i].label}</option>`)
                        }
                        traceSource.events.live(data.cameras[0].serial)
                        /*     if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                                for (let i = 0; i < data.cameras.length; i++) {
                                    $('#select').append(`<option value="${data.cameras[i].url.hls}">${data.cameras[i].label}</option>`)
                                }
                                traceSource.config.url = data.cameras[0].url.hls
                                traceSource.events.play()
                            } else {
                                for (let i = 0; i < data.cameras.length; i++) {
                                    $('#select').append(`<option value="${data.cameras[i].url.flv}" >${data.cameras[i].label}</option>`)
                                }
                                traceSource.config.url = data.cameras[0].url.flv
                                traceSource.events.play()
                            } */


                        $('.farmimg').attr('name', data.farmId)
                        const photoUrl = data.photoUrl.split(',')
                        for (let i = 0; i < photoUrl.length; i++) {
                            $('.photo').append(`<div class="col-xs-4 col-sm-4" onclick="traceSource.events.big('${photoUrl[i]}')"><img src="${photoUrl[i]}" alt="" class="img2"></div>`)
                        }
                        $('.img2').css('height', $('.img2').width() * 0.75)

                        var map = new BMap.Map("map");
                        var point = new BMap.Point(data.coords.split(',')[0], data.coords.split(',')[1]);
                        map.centerAndZoom(point, 16);
                        map.addControl(new BMap.NavigationControl());
                        map.disableDragging();
                        var opts = {
                            width: 200,
                            height: 30,
                            title: ''
                        }
                        var infoWindow = new BMap.InfoWindow(data.farmName, opts);
                        map.openInfoWindow(infoWindow, map.getCenter());
                    } else {
                        $(".exist").html("无效的二维码或标签号不存在.")
                        $('.hiden').hide()
                    }

                },

            })
        },
        GetQueryString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
        gotoDate() {
            var farmId = $('.farmimg').attr('name')
            traceSource.events.post({
                type: 'GET',
                url: 'https://ynyiot.com/api/no-auth/tracing/diagram-list',
                data: {
                    farmId: farmId,
                    beginTime: $('#datepicker').val() + " 00:00:00",
                    endTime: $('#datepicker').val() + " 23:59:59"
                },
                success(res) {
                    const data = res.data
                    $('.photo').html('')
                    if (data.length == 0) {
                        $('.photo').append('<div style="color:#F4A460;">您选择的日期当前并无图片!</div>')
                    } else {
                        for (let i = 0; i < data.length; i++) {
                            $('.photo').append(`<div class="col-xs-4 col-sm-4" onclick="traceSource.events.big('${data[i]}')"><img src="${data[i]}" alt="" class="img2"></div>`)
                            $('.img2').css('height', $('.img2').width() * 0.75)
                        }
                    }
                }
            })
        },
        big(picSrc) {
            $('.pic02 img').attr('src', picSrc)
            $('.pic02').show()
        },
        hide() {
            $('.pic02').hide()
        },
        live(code) {
            traceSource.events.post({
                url: "https://ynyiot.com/ys7/lapp/token/get?appKey=1ea8a5815b1b4e86b6ae33123b893b77&appSecret=d38c5fcdd75f20204a011dd714e48f8d",
                success(res) {
                    traceSource.config.accesstoken = res.data.accessToken
                    traceSource.config.expireTime = res.data.expireTime
                    traceSource.events.geturl(code)
                }
            })
        },
        select() {
            var code = $('select option:selected').val()
            traceSource.events.live(code)
            // traceSource.events.start(code)

        },
        geturl(code) {
            traceSource.events.post({
                url: "https://open.ys7.com/api/lapp/live/address/limited",
                data: {
                    accessToken: traceSource.config.accesstoken,
                    deviceSerial: code,
                    channelNo: 1,
                    expireTime: 300
                },
                success(res) {
                    if(res.code=='60060'){
                         traceSource.events.post({
                              url:'https://open.ys7.com/api/lapp/live/video/open',
                              data:{
                                accessToken:traceSource.config.accesstoken,
                                source:code+':1'
                              },
                              success(res){
                                   if(res.code==200){
                                       traceSource.events.geturl(code)
                                   }
                              }
                         })
                    }
                    traceSource.config.url = res.data.liveAddress.replace(/^http:\/\//, "https://");
                    if (traceSource.config.play) {
                        traceSource.config.play.dispose()
                    }
                    traceSource.events.play()


                }
            })
        },
        play() {
            traceSource.config.play = new Aliplayer({
                "id": "player-con",
                "source": traceSource.config.url,
                "width": "100%",
                "height": "500px",
                "autoplay": true,
                "isLive": true,
                "rePlay": true,
                "playsinline": true,
                "preload": true,
                "controlBarVisibility": "hover",
                "useH5Prism": true
            }, function (player) {
                player._switchLevel = 0;
                console.log("播放器创建了。");

            }
            );
        },
        start(url) {
            if (traceSource.config.play) {
                traceSource.config.play.dispose()
            }
            traceSource.config.url = url
            traceSource.events.play()
        },
        post(obj) {
            $.ajax({
                type: obj.type ? obj.type : "POST",
                url: obj.url,
                data: obj.data || {},
                dataType: obj.dataType || 'json',
                success: (res) => {
                    obj.success(res)
                }
            })
        }

    },
    config: {
        url: "",
        play: null,
        accesstoken: '',
        expireTime: '',
        init() {
            traceSource.events.load()
        }
    }
}
$(function () {
    traceSource.methods.init()
    traceSource.config.init()

})
