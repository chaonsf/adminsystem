import axios from 'axios'

export const Myget=(param,url)=>{
    return new Promise((resolve,reject)=>{
          axios.get(url,param).then(res=>{
               resolve(res.data)
         })
         .catch(err=>{
             reject(err)
         })
    })
}