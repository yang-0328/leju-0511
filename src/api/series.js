import request from '@/api/request'
import hostSetting from "@/api/config"

function seriesList(data) {
    return request({
        url: hostSetting.host + '/api/leju/admin/series/list', // 相对路径
        method: 'get',
        data
    })
}

export default {
    seriesList
}