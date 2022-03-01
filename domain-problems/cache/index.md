### Caching & Batching

批处理（batching）将几个连续的相同请求合并为一个，完成后统一触发回调。缓存在请求完成对结果进行保存，对相同请求直接返回已有结果，不触发再次处理。Caching 需要配合批处理使用，因为可能在没有缓存的情况下，可能有多个相同请求并行存在，会造成缓存在多个请求完成后被多次设置。

缓存策略

1. Least Recently Used 确保常量大小的缓存
1. 分布式缓存 Redis Memcached
1. 缓存失效策略
1. https://coolshell.cn/articles/20793.html

https://coolshell.cn/articles/17416.html
