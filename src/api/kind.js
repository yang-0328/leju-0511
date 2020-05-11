// 引入自行封装的axios
import request from '@/api/request'
import hostSetting from "@/api/config"





function kindList(data) {
    return request({
        url: hostSetting.host + '/api/leju/admin/kind/list', // 相对路径
        method: 'get',
        data
    })
}
export default {

    kindList
}