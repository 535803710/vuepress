# 广度优先算法 （Breadth-First Search，BFS）

```js
function bfsTraversal(root) {
  if (root === null) return;

  const queue = [root]; // 初始化队列，将根节点加入队列

  while (queue.length > 0) {
    const node = queue.shift(); // 从队列中取出一个节点

    console.log(node.value); // 访问该节点

    // 将该节点的子节点加入队列
    if (node.left !== null) {
      queue.push(node.left);
    }
    if (node.right !== null) {
      queue.push(node.right);
    }
  }
}

// 创建一个示例树
//      1
//     / \
//    2   3
//   / \   \
//  4   5   6

const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
root.right.right = new TreeNode(6);

// 执行BFS遍历
bfsTraversal(root);
```

**步骤：**

1. 设置一个空的数组或者集合存放**队列**
2. 初始化队列：将根节点加入**队列**。
3. 循环遍历队列吗，队列不为空时进行：
   1. 从头部去取出一个节点
   2. 访问或处理该节点
   3. 将该节点的左节点或者右节点放在队列中
4. 队列为空时，遍历完所有的节点。

# 深度优先算法 （Depth-First Search，DFS）

**递归方法**

```js
function dfsTraversal(node) {
  if (node === null) return;

  console.log(node.value); // 访问当前节点

  dfsTraversal(node.left); // 递归访问左子节点
  dfsTraversal(node.right); // 递归访问右子节点
}

// 执行DFS遍历
dfsTraversal(root);
```

**遍历方法**

```js
function dfsTraversalIterative(root) {
  if (root === null) return;

  const stack = [root]; // 初始化栈，将根节点推入栈

  while (stack.length > 0) {
    const node = stack.pop(); // 从栈中弹出一个节点

    console.log(node.value); // 访问该节点

    // 将子节点推入栈（注意顺序，先右后左，这样左子节点会先被处理）
    if (node.right !== null) {
      stack.push(node.right);
    }
    if (node.left !== null) {
      stack.push(node.left);
    }
  }
}

// 执行DFS遍历（显式栈方式）
dfsTraversalIterative(root);
```

**递归 vs 栈实现**

- 递归实现：代码简洁，但受限于调用栈的深度，可能导致栈溢出。
- 显式栈实现：更加灵活，可以处理更深的树或图，但代码相对复杂。

# LRU 算法 (Least Recently Used)

1. 记录一个缓存列表
2. 快读访问
3. 更新缓存列表
4. 淘汰超出容量限制的
```js
class Node {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.hashMap = new Map();
        this.head = new Node();
        this.tail = new Node();
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    get(key) {
        if (this.hashMap.has(key)) {
            const node = this.hashMap.get(key);
            this.moveToHead(node);
            return node.value;
        }
        return -1;
    }

    put(key, value) {
        if (this.hashMap.has(key)) {
            const node = this.hashMap.get(key);
            node.value = value;
            this.moveToHead(node);
        } else {
            const newNode = new Node(key, value);
            this.hashMap.set(key, newNode);
            this.addToHead(newNode);

            if (this.hashMap.size > this.capacity) {
                const removedNode = this.removeTail();
                this.hashMap.delete(removedNode.key);
            }
        }
    }

    moveToHead(node) {
        this.removeNode(node);
        this.addToHead(node);
    }

    addToHead(node) {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next.prev = node;
        this.head.next = node;
    }

    removeNode(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    removeTail() {
        const removedNode = this.tail.prev;
        this.removeNode(removedNode);
        return removedNode;
    }
}

```
