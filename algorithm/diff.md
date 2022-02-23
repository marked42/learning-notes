# Git Diff 原理

文章内容

1. 编辑距离问题 edit distance/edit graph
   https://xlinux.nist.gov/dads/HTML/Levenshtein.html
1. 最长公共子串 longest common sequence / shortest edit script
   1. 递归的解法
   1. 从左上角到又下角，按步迭代的方式求解 广度优先搜索的思路
   1. 求所有路径
1. levensten distance
1. myers algorithm
   1. 同样的字符串 diff 有多种，那种算是最直观的？编辑距离最短，先删除后添加，批量删除批量添加优于删除添加交替出现
   1. 在最长公共子串按步迭代的基础上添加约束条件 k = x - y 解释几个概念 k line, d contour, snake, d 的返回，k 的范围步长
   1. x 的选择没有特殊性，x/y 是等价的
   1. k from -d to d by step 2，方向无所谓
   1. 解释从 d 步如何求得 d + 1，前后步骤的 k 线上点的关系 f(k + 1, k - 1) -> k
   1. v[1] = 0 解释初始状态
   1. 不需要保存 y
   1. 因为 d + 1 只依赖 d，而且不覆盖，所以可以进行状态压缩，只使用一个数组。
   1. 结束条件
1. 反向 myers 算法
1. 线性空间 myers

参考资料

1. [An O(ND) Difference Algorithm and Its Variations](http://www.xmailserver.org/diff2.pdf)
1. [Git 是怎样生成 diff 的：Myers 算法](https://cjting.me/2017/05/13/how-git-generate-diff/)
1. [The Myers diff algorithm: part 1](https://blog.jcoglan.com/2017/02/12/the-myers-diff-algorithm-part-1/)
1. [The Myers diff algorithm: part 2](https://blog.jcoglan.com/2017/02/15/the-myers-diff-algorithm-part-2/)
1. [The Myers diff algorithm: part 3](https://blog.jcoglan.com/2017/02/17/the-myers-diff-algorithm-part-3/)
1. [Myers diff in linear space: theory](https://blog.jcoglan.com/2017/03/22/myers-diff-in-linear-space-theory/)
1. [Myers diff in linear space: implementation](https://blog.jcoglan.com/2017/04/25/myers-diff-in-linear-space-implementation/)
1. [GIT SOURCE CODE REVIEW: DIFF ALGORITHMS](https://fabiensanglard.net/git_code_review/diff.php)
1. [Jest diff-sequences](https://github.com/facebook/jest/tree/main/packages/diff-sequences)
1. [Edit Distance](https://leetcode-cn.com/problems/edit-distance/)
1. [Longest Common Subsequence]

1. [Investigating Myers' Diff Algorithm: Part 1 of 2](https://www.codeproject.com/Articles/42279/Investigating-Myers-diff-algorithm-Part-1-of-2)
1. [Investigating Myers' Diff Algorithm: Part 2 of 2](https://www.codeproject.com/Articles/42280/Investigating-Myers-Diff-Algorithm-Part-2-of-2)

应用

1. [diff-match-patch](https://github.com/google/diff-match-patch)
1. [fuzzy patch](https://neil.fraser.name/writing/patch/)
1. [git xdiff](https://github.com/git/git/blob/b06d3643105c8758ed019125a4399cb7efdcce2c/xdiff/xdiffi.c#L347)
1. [unix diff](https://github.com/Distrotech/diffutils/blob/9e70e1ce7aaeff0f9c428d1abc9821589ea054f1/src/analyze.c#L559)
1. [DiffUtil 和它的差量算法](https://cloud.tencent.com/developer/article/1781661?from=article.detail.1724029)
1. [fast-myers-diff](https://www.npmjs.com/package/fast-myers-diff)

   https://github.com/gitextensions/gitextensions/issues/6991
