// 引入自行封装的axios
import request from '@/api/request'
import hostSetting from "@/api/config"



function brandList(data) {
    // 返回了promise对象 
    return request({
        url: hostSetting.host + '/api/leju/admin/brand/list',
        method: 'get',
        data
    })
}

function brandListAll(data) {
    return request({
        url: hostSetting.host + '/api/leju/admin/brand/listAll', // 相对路径
        method: 'get',
        data
    })
}
export default {

    brandList,
    brandListAll
}