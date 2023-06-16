import request from '/@/utils/request';


export function useChartsApi(params: object) {
    return request({
        url: "/",
        method: "get",
        data: params,
    });
}
