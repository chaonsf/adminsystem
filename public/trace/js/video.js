var Aplayer={
        methods:{
            init(){

            }
        },
        events:{
            GetQueryString(name){
                var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if(r!=null)return  unescape(r[2]); return null;
              },
              start(){
                 Aplayer.config.play= new Aliplayer({
                    "id": "playeron",
                    "source":Aplayer.config.url,
                    "width": "100%",
                    "height": "100%",
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
              }
              
        },
        config:{
            url:"",
            play:null,
            init(){
                  let  barcode =Aplayer.events.GetQueryString("url") 
                  Aplayer.config.url=barcode;
                  if(Aplayer.config.play){
                       Aplayer.config.play.dispose()
                       Aplayer.events.start()
                  }else{
                    Aplayer.events.start()
                  }
            }
        }
}
$(function(){
     Aplayer.config.init()
     Aplayer.methods.init()
})