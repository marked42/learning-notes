# Spring

## Bean

### 命名

默认生成唯一的名称，通过Bean类型进行自动绑定，无法按照名称引用该Bean。

```xml
<bean id="uniqueId" name="first,last" class="examples.Service"/>
<alias name="first" alias="second"/>
```

```java
@Configuration
public class BeanConfiguration {
    @Bean(name = {"first", "second"}) 
    public MyBean prototypeBean() {
        return new MyBean();
    }
}
```

xml中`id`必须唯一，`ApplicationContext`会进行检测，`name`可以指定多个名称，`alias`标签
可以用来添加别名。

`@Bean`注解可以同时指定多个名称

1. @Bean用在@Configuration注解的类方法上用来生命BeanPostProcessor/BeanFactoryPostProcessor类型的Bean时，应该注解在static方法上，
因为instance方法会要求Configuration注解类进行提前实例化。
1. @Autowired和@Value不能使用在@Configuration标注的配置类上，因为该类实例化较早，其他普通的Bean还没有实例化，无法正常注入。


### 初始化

// TODO: 如何指定构造函数或者工厂函数的参数？

三种Bean构造方法

1. 类构造函数构造
1. 类静态方法构造
1. 类实例方法构造

```xml
<beans>
    <!--1. call class constructor-->
    <bean id="exampleBean" class="examples.ExampleBean"/>
    <bean name="anotherExample" class="examples.ExampleBeanTwo"/>
    
    <!--内部类名用$符号指示-->
    <bean name="innerClassBean" class="examples.OuterClass$InnerClass"/>
    
    
    <!--2. call static factory method: examples.ClientService.createInstance()-->
    <bean id="clientService"
        class="examples.ClientService"
        factory-method="createInstance"/>

    <!-- the factory bean, which contains a method called createInstance() -->
    <bean id="serviceLocator" class="examples.DefaultServiceLocator">
        <!-- inject any dependencies required by this locator bean -->
    </bean>

    <!-- 3. call factory bean instance method: serviceLocator.createClientServiceInstance -->
    <bean id="clientService"
        factory-bean="serviceLocator"
        factory-method="createClientServiceInstance"/>

</beans>
```

```java
@Configuration
class BeanConfigurations {
    @Bean(name = 'instanceBean')
    public MyBean instanceMethod() {
        return new MyBean();
    }
    
    @Bean(name = 'staticBean')
    public static MyBean staticMethod() {
        return new MyBean();
    }
}
```

### 依赖注入(Dependency Injection)

#### 构造函数依赖注入

#### setter方法

#### 属性

#### 循环依赖

两个Bean A和B直接或者间接的相互依赖会造成循环依赖的问题，导致Bean实例无法正常初始化。存在以下几种情况：

1. 两个Bean A和B都使用构造函数方式标识依赖对方。假如Bean A首先实例化，在构造函数调用时会需要Bean B的实例，造成Bean B实例化，在B的构造函数被调用时再次需要Bean A的实例，但是此时Bean A还未构造完成，会抛出异常`BeanCurrentlyInCreationException`。这种情况无论哪个Bean先实例化都会造成循环依赖。
1. Bean A和Bean B都使用setter方法或者属性的方式标识依赖对方。假如Bean A首先实例化，调用构造函数顺利完成构造，然后才自动装配属性或者setter方法的依赖。这时造成Bean B实例化，同样完成构造后，Bean B的属性或者setter函数对于Bean A的依赖被顺利装配，因为Bean A已经完成了初始化。这种情况无论哪个Bean先实例化都不会造成循环依赖。
1. 假如A构造依赖于B，B使用属性或者setter方法依赖于A。此时Bean实例的初始化顺序决定依赖能否正确装配。
    1. A首先实例化，然后造成B实例化，由于B不对A构造依赖所以顺利完成构造，然后B实例属性或者setter方法依赖需要A实例，但是A尚未完成构造，此时抛出异常。
    1. B首先实例化，B不构造依赖于A，所以B顺利的实例化，然后B实例属性或者setter方法依赖于A实例，造成A实例化，A构造依赖于B，此时B已经完成构造，依赖顺利装配到A。
   
综上所述，循环构造依赖会导致依赖装配过程失败，使用属性依赖或者setter函数依赖的方式可以解决循环依赖装配失败的问题。混合使用构造函数依赖和setter方法依赖，装配能否成功取决于Bean实例化的顺序，将构造依赖于其他Bean的Bean实例放在后边时，依赖注入过程能够成功。但是推荐使用这种方式，因为实例初始化顺序不太方便通过配置来控制。 包扫描(component scan)的情况下，Bean实例化的顺序是根据类在包文件中的顺序决定。

注意`@Autowired(required = true)`默认为`true`，表示的是是否允许依赖的Bean实例为空，跟循环依依赖决策无关。

### 作用域（Scope）

1. 默认所有的Bean是Singleton Scope，对于一个Spring Container和一个指定名字来说，永远返回同一个Bean。
1. Prototype类型Bean，显式或者隐式的通过`getBean()`方法去获取Bean时都会返回一个新创建的Bean。
1. 无状态的Bean使用Singleton，有状态的Bean使用Prototype。
1. Prototype类型的Bean实例化(instantiation)时会调用初始化回调函数，但是Spring容器并不管理Prototype类型Bean的其他生命周期，销毁回调函数不会调用，需要客户端自行处理。
1. 如果一个Singleton的Bean依赖于Prototype的Bean，在Singleton Bean初始化时会绑定一个Prototype Bean实例且不会再变化，以后再获取Singleton Bean时其依赖的Prototype Bean始终是最开始初始化时绑定的那个。如果想要每次都生成一个新的Prototype Bean实例，有两种方法:
    1. 用方法注入(Method Injection)。
    1. 使用作用域代理`proxyMode`
        ```java
        @Component
        @Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE, proxyMode = ScopedProxyMode.TARGET_CLASS)
        public class PrototypeBean {
         }
        ```
    

TODO: problems
1. how other generate multiple object from objectFactory
1. figure out details of RequestScope/SessionScope/ApplicationScope/WebsocketScope/SimpleThreadScope
1. Prototype Bean被代理内部原理

### 方法注入 (Method Injection)

#### 查找方法注入 （Lookup Method Injection）

通过将Spring容器中某个Bean的某个方法标记为查找方法，后续容器提供查找方法指定的Bean时，将查找方法的返回结果作为Bean实例提供。

```xml
<!-- a stateful bean deployed as a prototype (non-singleton) -->
<bean id="myCommand" class="fiona.apple.AsyncCommand" scope="prototype">
    <!-- inject dependencies here as required -->
</bean>

<!-- commandProcessor uses statefulCommandHelper -->
<bean id="commandManager" class="fiona.apple.CommandManager">
    <lookup-method name="createCommand" bean="myCommand"/>
</bean>
```

```java
@Component
public class Command {
    
}

@Component
public abstract class CommandManager {

    public Object process(Object commandState) {
        Command command = createCommand();
        command.setState(commandState);
        return command.execute();
    }

    @Lookup("myCommand")
    protected abstract Command createCommand();
}
```

上述配置中在`CommandManager`Bean中指定其`createCommand`方法是查找方法，容器提供名称为`myCommand`的Bean时会用`createCommand`方法返回值替代。
`@Lookup`注解可以不用显示置顶名称`myCommand`而是通过方法返回值类型自动推断。

注意`Command`如果是Singleton Bean的话，配置查找方法并没有什么用处，因为查找方法的返回值始终是这个Singleton Bean实例。
`Command`是Prototype Bean时，查找方法每次都会返回不同的Bean实例。

这样在Singleton Bean依赖了一个Prototype Bean并使用`@Autowired`的情况下，每次引用被依赖的Prototype Bean实际上获得是查找方法返回的新实例对象。

查找方法注入实现原理是生成了一个子类，继承标注了查找方法的类，子类中对于查找方法进行重载(override)或者重写(overwrite)。
因此对被标记为查找方法的方法签名有一定要求：

```
<public|protected> [abstract] <return-type> theMethodName(no-arguments);
```

1. https://my.oschina.net/zudajun/blog/664659

#### 任意方法替换(Arbitrary Method Replacement)


### 生命周期回调函数(Lifecycle Callbacks)

Bean 生命周期可以通过几种方法注册初始化(initialization)和销毁(destroy)时候的回调函数。

1. 标准注解@PostConstruct和@PreDestroy
1. Bean实现InitializingBean和DisposableBean接口
1. 配置Bean的init-method和destroy-method

调用顺序

1. initialization：Constructor > @PostConstruct >InitializingBean > init-method
1. destroy: @PreDestroy > DisposableBean > destroy-method

默认生命周期函数

生命周期函数直接在原始Bean实例上调用，而不是被代理的Bean对象，这样避免生命周期函数和代理机制耦合。

```xml
<!--默认生命周期函数设置为init-->
<beans default-init-method="init">
    <bean id="blogService" class="com.something.DefaultBlogService">
        <property name="blogDao" ref="blogDao" />
    </bean>
</beans>
```

### BeanPostProcessor

#### RequiredAnnotationBeanPostProcessor

@Required

#### AutowiredAnnotationBeanPostProcessor

@Autowired, @Value, @Inject

#### CommonAnnotationBeanPostProcessor

@PostConstruct, @PreDestroy, @Resource

#### InitDestroyAnnotationBeanPostProcessor

#### PersistenceAnnotationBeanPostProcessor

### BeanFactoryPostProcessor

PropertyPlaceholderConfigurer
PropertyOverrideConfigurer

### 按类型匹配Bean

#### @Autowired

```java
public class SimpleMovieLister {
    private MovieFinder movieFinder;
    
    // 1. 标注在属性上
    @Autowired
    public MyBean myBean;
    
    // 2. Spring 4.3开始只有一个构造函数时不用显式标注 @Autowired
    SimpleMovieLister() {
        
    }
    
    // 2. 有多个构造函数时需要手动标注@Autowired
    @Autowired
    SimpleMovieLister(String name) {
        
    }

    // 3. 标注在其他任意函数上典型的是setter函数
    @Autowired
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // 4. 标注在数组类型的属性上，自动注入容器中所有此类型的Bean实例
    @Autowired
    private MovieCatalog[] movieCatalogs;
    
    
    // 4. 对于其他泛型集合类型同样使用，标注在函数上。这种情况下可以通过实现
    // org.springframework.core.Ordered接口或者@Order,@Priority标注来指定Bean实例顺序，
    // 不指定时默认为Bean的注册顺序
    private Set<MovieCatalog> movieCatalogs;
    @Autowired
    public void setMovieCatalogs(Set<MovieCatalog> movieCatalogs) {
        this.movieCatalogs = movieCatalogs;
    }
    
    
    // 4. Map类型也支持，String类型的key是Bean的名字
    private Map<String, MovieCatalog> movieCatalogs;
    @Autowired
    public void setMovieCatalogs(Map<String, MovieCatalog> movieCatalogs) {
        this.movieCatalogs = movieCatalogs;
    }
    
    
    // 5. @Autowired默认注入的Bean实例时必须的，如果容器中找不到合适的Bean实例会报错，使用@Autowired(required = false)
    // 表示注入非必须，找不到时不报错。required = false的注入函数，找不到Bean实例时函数不会被调用。
    private MovieFinder movieFinder;
    @Autowired(required = false)
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }
}
```

#### @Primary

当容器中存在若干个某种类型的Bean实例时，使用@Primary标注其中一个，可以使这个Bean实例在按类型提供时总是优先被使用。

```java
@Configuration
public class MovieConfiguration {

    @Bean
    @Primary
    public MovieCatalog firstMovieCatalog() { ... }

    @Bean
    public MovieCatalog secondMovieCatalog() { ... }

    // ...
}

public class MovieRecommender {
    // wire other firstMovieCatalog
    @Autowired
    private MovieCatalog movieCatalog;
}
```

#### @Qualifier

@Qualifier用来标注Bean实列，一般用来描述Bean具有什么特性，而不是一个唯一的id。@Qualifier同时使用到自动注入的参数或者属性上，用来从
同一类型的若干个Bean实例中筛选出和指定Qualifier一致的一组Bean实例子集。

```java
public class MovieRecommender {

    // 1. 在属性上使用@Qualifier
    @Autowired
    @Qualifier("main")
    private MovieCatalog movieCatalog;
}

public class MovieRecommender {

    private MovieCatalog movieCatalog;

    private CustomerPreferenceDao customerPreferenceDao;

    // 1. 在参数上使用@Qualifier
    @Autowired
    public void prepare(@Qualifier("main") MovieCatalog movieCatalog,
            CustomerPreferenceDao customerPreferenceDao) {
        this.movieCatalog = movieCatalog;
        this.customerPreferenceDao = customerPreferenceDao;
    }

    // ...
}

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Qualifier
public @interface Genre {

    String value();
}

public class MovieRecommender {

    // 2. 使用自定义Qualifier注解
    @Autowired
    @Genre("Action")
    private MovieCatalog actionCatalog;

    private MovieCatalog comedyCatalog;

    @Autowired
    public void setComedyCatalog(@Genre("Comedy") MovieCatalog comedyCatalog) {
        this.comedyCatalog = comedyCatalog;
    }

    // ...
}
```

如果Bean的类型是泛型类，那个可以根据泛型类型自动区分。

Autowire按类型注入的过程由AutowireCandidateResolver处理
1. 按类型找到autowire-candidates
1. 根据beans的Qualifier或者自定义Qualifier注解和 CustomAutowireConfigurer
1. 多个符合条件的candidates中如果有且只有一个标注了Primary的，选取改Bean实例。

### 按名称 匹配Bean

@Resource只支持使用到属性(Field)和只有一个参数的setter函数上。

```java
public class SimpleMovieLister {

    // 1. 按名称注入Bean
    @Resource(name="myMovieFinder") 
    private MovieFinder movieFinder;

    // 2. 按名称注入Bean
    @Resource(name="myMovieFinder") 
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }
    
    // 3. 标注在属性上省略名称时，使用属性名
    @Resource
    private MovieFinder movieFinder;

    // 4. 标注在setter方法上省略名称时，使用setter函数名去掉前缀"set"的名称
    @Resource 
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }
}
```

@Resource注解找不到时，fallback到按类型匹配

### Configuration @Import @Conditional @Profile

@Profile用@Conditional实现

```java
@Override
public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
    if (context.getEnvironment() != null) {
        // Read the @Profile annotation attributes
        MultiValueMap<String, Object> attrs = metadata.getAllAnnotationAttributes(Profile.class.getName());
        if (attrs != null) {
            for (Object value : attrs.get("value")) {
                if (context.getEnvironment().acceptsProfiles(((String[]) value))) {
                    return true;
                }
            }
            return false;
        }
    }
    return true;
}
```

### @Profile

@Profile注解在同一个名称的若干个重载函数上时候，必须所有函数的@Profile注解值一样，不一样的话只有第一个用到的函数上的@Profile注解会起作用。
@Profile注解不能用来在若干个重载函数上相互区分。

默认激活的Profile名称为"default",可以通过配置文件或者命令行将默认激活Profile设置为其他名称。

1. 配置文件`spring.profiles.default` 可以是逗号或者空格分隔的多个Profile名称
1. `env.setDefaultProfiles`

设置当前激活的profile。
1. 使用`setActiveProfiles`函数显式设置
    ```java
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
    ctx.getEnvironment().setActiveProfiles("development");
    ctx.register(SomeConfig.class, StandaloneDataConfig.class, JndiDataConfig.class);
    ctx.refresh();
    ```
1. 命令行参数 `-Dspring.profiles.active="profile1,profile2"`
1. 设置配置文件`spring.profiles.active`值，系统环境变量,jvm环境变量，servelet context parameter in web.xml,
1. 在spring-test模块中使用@ActiveProfiles注解
    ```java
    package com.bank.service;

    @RunWith(SpringRunner.class)
    // ApplicationContext will be loaded from "classpath:/app-config.xml"
    @ContextConfiguration("/app-config.xml")
    @ActiveProfiles("dev")
    public class TransferServiceTest {

        @Autowired
        private TransferService transferService;

        @Test
        public void testTransferService() {
            // test the transferService
        }
    }
    ```
 
 ### PropertySource
 
 `PropertySource`是对一个包含若干配置属性的来源进行的抽象。
 
 ```java
PropertySource ps = new PropertySource();
ps.containsProperty('property-name')
ps.getProperty('property-name')
```
 Spring容器的环境Environment抽象包含一组有先后顺序的`PropertySource`对象实例，用来实现从多个来源确定某个具体属性的值。
 
 1. StandardEnvironment 包含 JVM系统变量 `System.getProperties()` 和 系统环境变量 `System.getenv()`
 1. StandardServletEnvironment 包含的PropertySource对象按优先级从高到底排列
    1. ServletConfig parameters (if applicable — for example, in case of a DispatcherServlet context)
    1. ServletContext parameters (web.xml context-param entries)
    1. JNDI environment variables (java:comp/env/ entries)
    1. JVM system properties (-D command-line arguments)
    1. JVM system environment (operating system environment variables)


可以添加自定义的PropertySource

1. 显示调用`MutablePropertySources.addFirst()`函数
    ```java
    ConfigurableApplicationContext ctx = new GenericApplicationContext();
    MutablePropertySources sources = ctx.getEnvironment().getPropertySources();
    sources.addFirst(new MyPropertySource()); 
    ```
1. 通过@PropertySource注解注入到*注解@Configuration所在的类*其中`my.placholder`属性的值会根据当前已经注册的PropertySource对象进行查询，冒号后边`default/path`是默认值。如果属性值不存在同时没有配置默认值的话会抛出异常。
    ```java
    // 1. 可以自定PropertySource
    @PropertySource("classpath:property-source.properties")
    public @interface AppPropertySource {
       String value() default ""; 
    }
 
    // 2. PropertySource可以配置多个，一般不推荐混合使用@PropertySource和自定义的注解
    @Configuration
    @PropertySource(property-source.properties)  // 优先级 2 次之
    @AppPropertySource                           // 优先级 3 最低
    @PropertySource(property-source.properties)  // 优先级 1 最高
    public class AppConfig {

        @Autowired
        Environment env;

        @Bean
        public TestBean testBean() {
            TestBean testBean = new TestBean();
            testBean.setName(env.getProperty("testbean.name"));
            return testBean;
        }
    }
    ```
 
 TODO: PropertyPlaceholderConfigurer
 
### Spring注解编程模型 

术语


元注解(Meta-Annotation)是标注在其他注解上的注解。复合注解指被一个或者多个元注解标记的注解，使用一个复合注解相当于同时对应的多个元注解。

`Stereotype Annotation`注解标记在应用程序中具有某种功能的类，包括数据@Component/@Repository/@Controller/@Service/。

1. `@Component` 能被扫描
1. `@Repository`/`@Controller`/`@Service`

`Composed Annotation`复合注解

1. *directly present*
1. *indirectly present*
1. *present*
1. *meta-present*
1. *associated*


TODO: 上述术语中present与AnnotatedElement的API含义一致。

1. `getAnnotations()`
1. `getDeclaredAnnotations()`
1. `isAnnotationPresent()`


Spring 注解文档 



1. https://github.com/spring-projects/spring-framework/wiki/Spring-Annotation-Programming-Model

### Component Scan

默认情况下，所有被@Component注解直接或者间接标注(meta-annotated)的类会被自动扫描识别为Bean。 使用`@ComponentScan(useDefaultFilters = false)`可以禁用对于@Component/@Repository/@Service/@Controller等注解标注的类自动扫描。

此时需要自定义扫描策略，`includeFilters`/`excludeFilters`字段接受Filter的数组可以包含或者排除符合Filter条件的类。一个Filter包括type, value, pattern三个值。

1. `annotation`: value/pattern置顶的annotation出现在目标类上
1. `assignable`: 目标类能够赋值给value/pattern指定的类或者接口
1. `aspectj`: 目标类符合value/pattern指定的apsectj表达式
1. `regex`: 目标类类名符合value/pattern指定的表达式
1. `custom`: 

完整的使用示例：

```java
// 自定义nameGenerator
@ComponentScan(
    basePackages = "",
    basePackageClasses = {},
    includeFilters = @Filter(type = FilterType.REGEX, pattern = ".*Stub.*Repository"),
    excludeFilters = @Filter(Repository.class),
    
    nameGenerator = MyNameGenerator.class,
    scopeResolver = MyScopeResolver.class,
    lazyInit = false,
    
    // 默认Bean Scope代理生成策略
    scopedProxy = ScopedProxyMode.DEFAULT,
    
    // 指定哪些文件是被扫描的类文件
    resourcePattern = ClassPathScanningCandidateComponentProvider.DEFAULT_RESOURCE_PATTERN
)
```

1. ClassPathBeanDefinitionScanner 扫描一个Configuration类上定义的Bean Definition
1. @Import/@ImportResource如何处理
1. Configuration类如何收集
1. ComponentScan配置 ComponentScanAnnotationParser
    1. Repeatable
    1. 指定初始的扫描范围 values/basePackages/basePackageClasses/默认是@ComponentScane注解所在的类
    1. 过滤Bean类
        1. resourcePattern
        1. includeFilters/excludeFilters
            1. FilterType 不同类型的FilterType. type value/classes/pattern
                1. ANNOTATION - AnnotationTypeFilter
                1. ASSIGNABLE_TYPE - AssignableTypeFilter
                1. CUSTOM
                1. ASPECTJ - AspectJTypeFilter
                1. REGEX - RegexPatternTypeFilter
            1. useDefaultFilters Component/ManagedBean/Named
    1. 单个Bean定义
        1. nameGenerator - BeanNameGenerator
        1. scopeResolver - AnnotationScopeMetadataResolver
        1. lazyInit
        1. scopedProxy - ScopedProxyMode.DEFAULT
    
 ### @Alias Processing