
# 参数
1. n1 - 旧的节点
2. n2 - 新的节点
3. container 挂载点

# 思路

1. 循环遍历 比较
   1. 是否被处理过（6 中的非理想情况）。
   2. 新首-旧首，打补丁，新首节点索引+1，旧首节点索引+1。
   3. 新尾-旧尾，打补丁，新尾节点索引-1，旧尾节点索引-1。
   4. 新尾-旧首，打补丁，旧首对应的 DOM 移动到旧尾节点的后面，新尾节点索引-1，旧首节点索引+1。
   5. 新首-旧尾，打补丁，旧尾对应的 DOM 移动到旧首节点的前面，新首节点索引+1，旧尾节点索引-1。
   6. 考虑非理想情况 在旧节点组中找新首。找到则将 DOM 移动到最前，且在旧节点组中设为 undefined；没找到则添加新元素到最前。
2. 如果有新节点剩下，遍历剩下的新节点，挂载到当前旧节点组的头部节点。
3. 如果有旧节点剩下，遍历剩下的旧节点，卸载。

# 流程图
## 准备工作
![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/1f3ec2b44dad4fb023c3c0093c28240f.png)
<!-- ![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a805c71f1b984214b9ece63c7f58426f~tplv-k3u1fbpfcp-watermark.image?) -->

## 循环开始
![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/71bc38d2b18e7075b2940f4ad6b36408.png)
<!-- ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d2a03de523b44c31b6fb4e0f3948acad~tplv-k3u1fbpfcp-watermark.image?) -->

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/0f493f81f0cd2c53b3d1ea8a02b97d38.png)
<!-- ![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/391032d1f78e40b6a3c26e9d7c4ee414~tplv-k3u1fbpfcp-watermark.image?) -->

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/48bddd57d33e673734fa5741ea6aa39b.png)
<!-- ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be4a073073ce44018caea669f426465b~tplv-k3u1fbpfcp-watermark.image?) -->

## 循环完成，检查新增或者卸载

![](https://pub-a953275fa2c34c18b80fc1f84e3ea746.r2.dev/xiaowo/2023/08/0a96e217947b52360427b3a18a2ea56f.png)
<!-- ![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/695db641b6964121bcb7e7d1b90388db~tplv-k3u1fbpfcp-watermark.image?) -->



# 实现步骤

- 定义 `oldChildren` 为 n1 的 `children`
- 定义 `newChildren` 为 n2 的 `children`
  // 定义四个索引值
- 定义 `oldStartIndex` 为 `oldChildren` 的首位索引值
- 定义 `oldEndIndex` 为 `oldChildren` 的最后位索引值
- 定义 `newStartIndex` 为 `newChildren` 的首位索引值
- 定义 `newEndIndex` 为 `newChildren` 的最后位索引值
  // 定义四个索引所对应的 VNode 节点
- 定义 `oldStartVNode` 为 `oldChildren[oldStartIndex]`
- 定义 `oldEndVNode` 为 `oldChildren[oldEndIndex]`
- 定义 `newStartVNode` 为 `newChildren[newStartIndex]`
- 定义 `newEndVNode` 为 `newChildren[newEndIndex]`
  // 进行比较

- 循环？`newStartIndex <= newEndIndex` 且 `oldStartIndex <= oldEndIndex`

  1. oldStartVNode 不存在的话？ 说明该节点已经处理过了
     - 将 `oldStartVNode` 指向 `oldChildren[++oldStartIndex]`
  2. `oldStartVNode.key === newStartVNode.key` ?
     - 调用 `patch(oldStartVNode,newStartVNode,container)`打补丁
     - 将 `oldStartVNode` 指向 `oldChildren[++oldStartIndex]`
     - 将 `newStartVNode` 指向 `newChildren[++newStartIndex]`
  3. `oldEndVNode.key === newEndVNode.key` ?
     - 调用 `patch(oldStartVNode, newStartVNode, container)`打补丁
     - 将 `oldEndVNode` 指向 `oldChildren[--oldEndIndex]`
     - 将 `newStartVNode` 指向 `newChildren [--newStartIndex]`
  4. `oldStartVNode.key === newEndVNode.key` ?
     - 调用 `patch(oldStartVNode, newEndVNode, container )`打补丁
     - 调用 `insert(oldStartVNode.el ,container ,oldEndVNode.el.nextSiling )` 将 `oldStartVNode` 移动到 `oldEndVNode`的下一个节点 前
     - 将 `oldStartVNode` 指向 `oldChildren [ ++oldStartIndex ]`
     - 将 `newEndVNode` 指向 `newChildren[ --newEndIndex ]`
  5. `oldEndVNode.key === newStartVNode.key` ?

     - 调用 `patch( oldEndVNode, newStartVNode , container )`打补丁
     - 调用 `insert ( oldEndVNode.el , container , oldStartVNode.el )` 将 `oldEndVNode` 移动到 `oldStartVNode` 前
     - 将 `oldEndVNode` 指向 `oldChildren [ --oldEndIndex ]`
     - 将 `newStartVNode` 指向 `newChildren[ ++newStartIndex ]`

  6. 以上都不满足
     - 定义 `idxInOld` , 遍历 `oldChildren` ，找是否有和 `newStartVNode` 相同的 `key` ?
     - `idxInOld > 0 在 oldChildren` 中找到和 `newStartVNode` 相同的 `key`
       - 定义 `vnodeToMove` 为 `oldChildren[idxInOld]`
       - 调用 `patch( vnodeToMove, newStartVNode , container )`打补丁
       - 调用 `insert ( vnodeToMove.el , container , oldStartVNode.el )` 将 `vnodeToMove` 移动到 `oldStartVNode` 前
       - 将 `oldChildren[idxInOld]` 设置为 `undefined`
     - `idxInOld < 0` 没有找到
       - 调用 `patch(null,newStartVNode,container,oldStartVNode.el)`, 添加 `newStartVNode`
       - 将 `newStartVNode` 指向 `newChildren[ ++newStartIndex ]`

- `oldEndIndex < oldStartIndex && newEndIndex <= newStartIndex` 检查索引的情况，看是否有需要新增的节点
  - 循环剩下的新节点 然后调用 `patch(null,newChildren[i],container,oldStartVNode.el)` 新增到 oldStartVNode 前
- `newEndIndex < newStartIndex && oldEndIndex >= oldStartIndex` 检查是否有需要删除的节点
  - 循环剩下的旧节点，然后调用 `unmount(oldChildren[i])`



# 总结
双端diff算法指的就是在新旧两组节点的四个端点分别进行比较，并试图找到可用节点。相比较[简单diff算法](https://juejin.cn/post/7077875160425955342)，同样的场景下，DOM移动次数更少。