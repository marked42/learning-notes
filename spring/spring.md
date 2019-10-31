# Beans

## Scope

1. 默认所有的Bean是Singleton Scope，对于一个Spring Container和一个指定名字来说，永远返回同一个Bean。
1. Prototype类型Bean，显式或者隐式的通过`getBean()`方法去获取Bean时都会返回一个新创建的Bean。
1. 无状态的Bean使用Singleton，有状态的Bean使用Prototype。
1. Prototype类型的Bean实例化(instantiation)时会调用初始化回调函数，但是Spring容器并不管理Prototype类型Bean的其他生命周期，销毁回调函数不会调用，需要客户端自行处理。
1. 如果一个Singleton的Bean依赖于Prototype的Bean，在Singleton Bean初始化时会绑定一个Prototype Bean实例且不会再变化，以后再获取Singleton Bean时其依赖的Prototype Bean始终是最开始初始化时绑定的那个。如果想要每次都生成一个新的Prototype Bean实例，可以使用方法注入(Method Injection)。

Bean 生命周期

1. initialization：Constructor > @PostConstruct >InitializingBean > init-method
1. destroy: @PreDestroy > DisposableBean > destroy-method
