/**
 * table中，删除数据时，如果页数是最后一页，且当页只有一条，删除该条数据，防止请求当前页，并且显示无数据，即展示上一页数据
 * @param total 总数
 * @param pageSize 每页条数
 * @param pageNum 页码
 */
export function changePageNum(total, pageSize, pageNum) {
  const modularData = total % pageSize
  const integerPage = (total - modularData) / pageSize
  const lastPage = integerPage + (modularData === 0 ? 0 : 1)
  // 1.取模为1 2.当前删除数据所在页数为最后一页 3.当前页不是首页
  if (total % pageSize === 1 && pageNum === lastPage && pageNum > 1) {
    const newPageNum = pageNum - 1
    return newPageNum
  }
  return pageNum
}
