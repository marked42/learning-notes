# Tapable

SyncHook 的两个要求

1. 能够单独指定两个函数的先后顺序 `before`字段
1. 能够给每个函数指定一个优先级，按照优先级顺序执行，`stage`字段
1. 同一 stage 且未指定先后顺序的，按照添加顺序先后执行。
1. tap 名称不能为空，能重名么？
