# JVM

### Java Memory Model

1. 程序计数器
1. Java虚拟机栈(Java Virtual Machine Stacks)，每个线程对应一个私有的栈，每个方法执行时创建一个栈帧(Stack Frame)，
    1. 局部变量表： 存放基本类型，引用类型和returnAddress，编译期确定大小
        1. 线程请求的栈深度超出虚拟机栈深度限制，抛出`StackOverflowError`
        1. 虚拟机栈可以扩展，如果无法申请到足够的内存进行扩展，抛出`OutOfMemoryError`
    1. 操作数栈
    1. 动态链接
    1. 方法出口
1. 本地方法栈作用与虚拟机栈类似，但是执行的方法是`native`方法。
1. Java堆，Thread Local Allocation Buffer
1. 方法区
1. 运行时常量池(Runtime Constant Pool)
1. 直接内存

### 对象创建

1. 对象的创建
    1. 类加载检查
    1. 分配内存，使用CAS+失败重试或者Thread Local Allocation Bubffer保证分配原子性
    1. 并直接将内存空间初始化为0。
    1. 设置对象头
    1. `invokespecial`调用`init`初始化对象
1. 对象内存布局，对象元信息
    1. hash码，分代年龄，锁指针
    1. 对象类型指针，指向类数据的指针；数组类型还包括数组长度
    1. padding
1. 对象访问，对象引用类型有两种实现方式
    1. 句柄 - 引用对象记录对象的句柄，堆中专门有句柄池，其中保存了对象的类型信息和真正地址。
    1. 直接地址 - 对象本身必须包含类型信息
    
### OutOfMemoryError

1. Java堆溢出： 不断分配大对象耗尽堆内存
1. 虚拟机栈和本地方法栈溢出： 通过函数递归耗尽栈内存或者通过不断创建线程耗尽栈内存
1. 方法区： 通过创建大量的动态类耗尽方法方法区内存
1. 运行时常量池： 通过`String.intern()`不断往常量池中添加对象，耗尽内存
1. 直接内存： 使用`Unsafe`类申请直接内存

### 对象回收判定

#### 回收判断算法

1. 引用计数
1. 可达性分析算法，通过GC Roots对象沿引用链标记
    1. 虚拟机栈中本地变量表引用的对象
    1. 方法区中类静态属性，常量引用对象
    1. 本地方法栈中本地变量引用对象
    
#### 引用类型

1. 强引用
1. 软引用，内存不足时会回收
1. 弱引用，存活到下一次垃圾收集时
1. 虚引用，触发系统通知

#### Finalize

对象经过第一次gc被标记为不可触达后，不会立即回收，而是执行`finalize`方法，如果此时将其修改为可触达即可避免被会后。

#### 方法区回收

1. 方法区常量
1. 方法区类型数据

### 垃圾回收算法

1. 标记清除(mark sweep)
    1. 标记与清除过程效率低
    2. 内存碎片
1. 标记整理算法(mark compact) 效率一般，不存在内存碎片
1. 复制算法： 效率很高，不存在内存碎片，但是浪费一半的内存。
1. 分代算法： 新生代使用赋值算法；老生代使用标记清除或者标记整理。
    1. 首先在`Eden`分配，内存不够时发起minorGC，新生代包括Eden, FromSurvivor, ToSurvivor(`-XXsurvivorRatio=8`),使用复制算法。
    1. 大对象直接在进入老年代，`-XXPretenureSizeThreshold`大于这个值的对象直接进入老年代
    1. 长期存活的对象进入老年代，`-XXMaxTenureThreshold=15`大于这个年龄的对象进入老年代
    1. 动态判定： Survivor空间中相同年龄对象大小超过50%时进入老念叨
    1. 空间分配担保：新生代进入老年代时，如果老年代剩余空间不足以容纳所有新生代对象，允许HandlePromotionFailure担保失败会首先尝试minorGC，尽量降低FullGC;不允许的话直接FullGC.

GC Roots

1. 枚举根节点
1. 安全点
    1. 主动：在方法被编译时，插入自动自动区轮询gc标志位，决定是否挂起线程，进入gc
    1. 被动：因为方法内部调用别的方法而导致了gc，所以整个线程被挂起
1. 安全区：处于安全区的线程执行不会改变堆内存引用关系，不影响垃圾回收，可以与垃圾回收线程同时运行。

### 栈帧

1. 局部变量表 - 基本单位为slot，应当保证一个slot能够存储32位长度类型`boolean`/`byte`/`char`/`short`/`int`/`float`/reference/returnAddress
    1. 非`static`方法中`this`参数默认使用下表为0的局部变量
    1. 局部变量复用会影响垃圾回收行为
1. 操作数栈 - 编译时决定大小max stacks
1. 动态链接
1. 方法返回地址

方法调用过程

1. 方法解析，在类加载阶段将一部分符号引用解析为直接引用，静态方法包括`static`，`private`以及`final`方法。
    1. `invokestatic` 
    1. `invokespecial`
    1. `invokevirtual`
    1. `invokeinterface`
    1. `invokedynamic`
   
### 类文件结构

类文件是一串二进制字节流，总的来说包含固定大小
1. 魔数`CAFEBABE`
1. minor
1. major
1. 常量池长度(u2)最大有65536个常量，每个常量类型有固定的结构，