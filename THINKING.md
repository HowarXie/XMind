# 思考
>  根据要求，本人想要远程办公，特写下这篇
## Q&A
1. 加载我们所提供的数据
* 用`file input`导入文件, 再用`FileRender`解析并获取文件数据，详见[file-loader](./src/file-loader.js)
2. 以列表的形式展示账单内容，并且提供下拉框选择月份进行筛选，其中列表中所展示的账单为选择月份的账单；
* 写了一个简单的`grid`库[h-grid](./src/libraries/h-grid.js)去将数据展示成列表形式
* 根据所选月份筛选数据，然后更新表格数据
3. 支持使用者添加账单；
* 提供`dialog`添加新数据，新数据也要看是否满足筛选项，再更新表格数据
4. 简单地统计并展示所选月份的收入和支出总金额。
* 简单的数据叠加
```js
function calcAndUpdateAmount(filteredBills) {
    let sum = filteredBills.filter(bill => bill.type === 1).reduce((pre, cur) => pre + (+cur.amount), 0);
    incomeEl.innerText = sum.toFixed(2);

    sum = filteredBills.filter(bill => bill.type === 0).reduce((pre, cur) => pre + (+cur.amount), 0);
    expensesEl.innerText = sum.toFixed(2);
}
```
5. 对账单分类进行二次筛选；
* 在Q2的基础上添加一个筛选项
6. 对选择月份内的所有账单根据账单分类进行支出金额统计，并进行排序。
* 先筛选出支出项，再根据月份筛选
* 根据分类叠加数据，最后排序
* 写了一个简单的柱状图库[chart](./src/libraries/chart.js)，直观地显示数据

## 反思
* 只是简单设置了一些样式
* 用原生js做起来还是挺繁琐的，实际生产过程中，本人当然还是会选用成熟的框架和第三方库