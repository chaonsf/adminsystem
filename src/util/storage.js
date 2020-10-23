class Storage{
    constructor(name){
        this.name = 'storage';
    }
    setItem(params){
        let obj = {
            name:'',
            value:'',
            expires:"",
            startTime:new Date().getTime()//记录何时将值存入缓存，毫秒级
        }
        let options = {};
        Object.assign(options,obj,params);
        if(options.expires){
            localStorage.setItem(options.name,JSON.stringify(options));
        }else{
               let type = Object.prototype.toString.call(options.value);
            if(Object.prototype.toString.call(options.value) == '[object Object]'){
                options.value = JSON.stringify(options.value);
            }
            if(Object.prototype.toString.call(options.value) == '[object Array]'){
                options.value = JSON.stringify(options.value);
            }
            localStorage.setItem(options.name,options.value);
        }
    }
    getItem(name){
        let item = localStorage.getItem(name);
        try{
            item = JSON.parse(item);
        }catch(error){
           // item = item;
        }
        //如果有startTime的值，说明设置了失效时间
        if(item &&item.startTime){
            let date = new Date().getTime();
            //何时将值取出减去刚存入的时间，与item.expires比较，如果大于就是过期了，如果小于或等于就还没过期
            if(date - item.startTime > item.expires){
            //缓存过期，清除缓存，返回false
                localStorage.removeItem(name);
                return false;
            }else{
            //缓存未过期，返回值
                return item.value;
            }
        }else{
            return item;
        }
    }
    removeItem(name){
        localStorage.removeItem(name);
    }
    clear(){
        localStorage.clear();
    }
}
export default Storage