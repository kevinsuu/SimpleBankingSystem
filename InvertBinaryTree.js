class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function invertTree(root) {
  if (!root) {
    return null;
  }

  let queue = [root];

  while (queue.length > 0) {
    let current = queue.shift();

    [current.left, current.right] = [current.right, current.left];

    if (current.left) {
      queue.push(current.left);
    }

    if (current.right) {
      queue.push(current.right);
    }
  }

  return root;
}

function buildTree(nodes) {
  if (nodes.length === 0) return null;
  let root = new TreeNode(nodes[0]);
  let queue = [root];
  let i = 1;

  while (i < nodes.length) {
    let current = queue.shift();
    if (nodes[i] !== null) {
      current.left = new TreeNode(nodes[i]);
      queue.push(current.left);
    }
    i++;
    if (i < nodes.length && nodes[i] !== null) {
      current.right = new TreeNode(nodes[i]);
      queue.push(current.right);
    }
    i++;
  }

  return root;
}

function treeToArray(root) {
  if (!root) return [];
  let result = [];
  let queue = [root];

  while (queue.length > 0) {
    let current = queue.shift();
    if (current) {
      result.push(current.val);
      queue.push(current.left);
      queue.push(current.right);
    } else {
      result.push(null);
    }
  }

  while (result[result.length - 1] === null) {
    result.pop();
  }

  return result;
}

// 測資
let input1 = [5, 3, 8, 1, 7, 2, 6];
let tree1 = buildTree(input1);
let invertedTree1 = invertTree(tree1);
console.log(treeToArray(invertedTree1));

let input2 = [6, 8, 9];
let tree2 = buildTree(input2);
let invertedTree2 = invertTree(tree2);
console.log(treeToArray(invertedTree2));

let input3 = [5, 3, 8, 1, 7, 2, 6, 100, 3, -1];
let tree3 = buildTree(input3);
let invertedTree3 = invertTree(tree3);
console.log(treeToArray(invertedTree3));

let input4 = [];
let tree4 = buildTree(input4);
let invertedTree4 = invertTree(tree4);
console.log(treeToArray(invertedTree4));
