# Java

## 面向对象

### 访问控制

访问级别

1. 私有`private` - 只有声明该成员的类的内部能访问。
1. 包级私有`package-private` - 声明该成员的包内部任何类都可以访问，缺省级别。
1. 受保护的`protected` - 声明该成员的类的子类和该成员所在类的包内所有内能访问。
1. 公有的`public` - 任何地方可以访问
1. Java 9 模块访问级别？(TODO)

在满足功能的需求下应当尽量使用更严格的访问级别，将实现细节对外界隐藏。

1. 公有类的实例域不能是公有的。公有的实例域可以被外界随意改变，指向可变对象（例如数组）的公有`final`实例域也会被改变。
这些都不是线程安全的。即使是指向不可变对象的公有`final`实例域，暴露后成为`API`的一部分而后续为了兼容性不能修改实现。
1. 子类覆盖父类的函数时，子类函数的访问级别不能比父类严格，确保里氏替换原则成立。
1. 类上不要使用公有的静态`final`可变域对象（例如数组或者列表）或者返回这样对象的函数，这样外界可以修改其内容。使用指向不可变对象的`final`域，
或者是可变私有对象的拷贝，使得外部无法修改内部可变对象。


通常应该首先使用不可变类，不可变类对象不能被改变，因此是线程安全的。不可变类可以通过声明所有构造函数为`private`且提供公有的静态工厂函数实现，不可变类应该是`final`的，不允许
组子类覆盖其实现。不可变类的缺点在于如果需要表示很多不同的状态，则每一状态对应一个不可变实例，占用内存较多。这种情况下通常使用一个配套的可变类，
例如`StringBuilder`之于`String`类。

### 多态

类方法调用确定`this`绑定对象的过程叫做*method call binding*，在C等面向过程语言中绑定发生在编译期，称为 early-binding.
面向对象语言在运行时进行绑定，称为*late-binding*或*runtime biding*或*dynamic binding*用来实现多态。

Java中动态绑定发生在`public`或者`protected`的非静态类成员函数上，`static`/`final`(`private`方法默认是`final`)方法使用静态绑定。
子类不能重写(override)父类的`private`函数，如果子类有父类`private`函数相同签名的函数，会被当成覆盖行为而不会报错，所以重写函数时最好
使用`@Override`注解标明，保证重写行为正确。

考虑类成员之间的依赖关系：

1. 子类依赖父类的成员
1. 子类成员中后声明的成员可以依赖先声明的成员。

类对象初始化的过程必须保证被依赖的成员先初始化，然后依赖的成员才能初始化，否则初始化过程无法完成。因此子类的初始化过程如下：

1. 子类对象占用的内存被初始化为0。
1. 继承链的父类从上到下以此调用构造函数构造父类包含的成员，子类的构造函数中可以使用`super(args)`显式的指定要调用的父类构造函数，如果
没有显式指定则会调用父类的无参构造函数，如果父类没有`public`或者`protected`的无参构造函数，编译报错。一个类如果没有显式声明任何构造
函数的话，编译器会自动生成`public`的空实现无参构造函数。
1. 按照声明顺序调用类成员初始化语句。
1. 执行子类构造函数。

对象销毁时不需要手动释放内存，由垃圾收集器自动回收，但是如果类对象持有某些资源（如文件描述符，网络端口号）等，则必须手动释放资源。Java
没有析构函数的概念，所以需要自行编写函数比如`dispose`来释放资源。销毁时释放资源函数调用的顺序应当与初始化顺序相反：

1. 调用子类对象的`dispose`函数
1. 子类对象的`dispose`函数内部应按照声明逆序调用成员变量的`dispose`函数
1. 最后调用父类的`super.dispose()`函数。

C++中能发生多态行为的函数要被显式标记为虚函数`virtual`，Java中的非静态`public`和`protected`成员函数默认就是虚函数。在构造函数中最好
不要调用虚函数，因为父类构造函数中虚函数调用使得子类的函数实现被调用，但此时父类尚在构造，子类成员还没有初始化，子类函数中使用到了未初始化
的子类成员变量会造成潜在的风险。如果程序直接出错还能够及时发现，更有可能大部分情况下不会出错，但是极少数情况下才触发这个`bug`的话就比较
难以查找错误原因。所以构造函数应当尽量简单，只使用静态函数或者`private`成员函数。

### 抽象类

1. 使用`abstract`标记抽象类，允许抽象类上不包含任何抽象方法。抽象方法只能声明在抽象类中，如果类中包含至少一个未实现的抽象方法（可以是继承的也可以是自身声明的）
则该类是抽象类，必须用`abstract`关键字标记。
1. 抽象类不能进行实列化，而是作为公共功能的抽象基类存在。
1. 抽象类可以继承非抽象类

### 接口

1. 接口中声明的数据成员强制为`public static final`的，会被静态初始化。
1. 接口可以继承接口。
1. 接口可以嵌套在其他接口或者类中。
    1. 嵌套的私有接口不能被外界访问，可以由同层嵌套的`public class`实现，但是这个类实现了私有嵌套接口的实时不为外界所知。
    1. 方法返回的嵌套私有接口可以使用在同层由访问权限的函数参数。
    1. 嵌套在接口中的接口被强制为`public`，无法声明为`private`。

TODO: 接口中的成员：
    1. 内部类默认是`public static`的
    1. 方法没有`static`时默认为`abstract`的，不能有函数体；`static`时必须有函数体
    1. 成员变量

### 内部类

1. 非静态内部类，类对象生成时，默认有一个绑定的外部类对象，所以在内部定义中可以直接引用外部类的成员变量，
会被编译器自动绑定到外部类对象上。
    ```java
    class OuterClass {
        public static void main(String[] args){
            OuterClass o = new OuterClass();

            // 使用外部类对象加上.new语法显示生成内部类对象
            InnerClass i = o.new InnerClass();

            // 错误，外部类静态成员函数中不能直接使用内部类构造函数
    //        InnerClass i = new InnerClass();
        }

        public InnerClass getInnerClass() {
            // 在外部类的非静态成员函数中不用使用.new语法，直接生成内部类对象
            return new InnerClass();
        }


        class InnerClass {
            // 在内部类的非静态成员函数中，显示引用绑定的外部类对象。
            public OuterClass getBoundOuterClass() {
                return OuterClass.this;
            }
        }
    }
    ```
1. 非内部普通类可以声明为`public`访问权限或者不声明默认为包访问权限。内部类可以声明`public`/`protected`/`private`权限。
其中`private`权限的内部类只能在外部类的成员中函数中访问，其他地方无法访问到，因此`private`内部类是封装内部实现细节的一种手段。
`protected`内部类具有包权限，或者子类能够访问父类的`protected`内部类。
1. 内部类可以声明在函数scope或者函数内的任意`{}`语句的`scope`内，这样的内部类称为`local inner class`，可见性只在`scope`内。`
1. 在方法内部可以使用匿名内部类，默认使用父类无参构造函数，也可以指定`new AbstractParent(arg1)`,
1. 使用`static`描述的内部类是静态内部类，又称为嵌套类(nested class)。非静态内部类对象不与某个外部类对象绑定，并在
静态内部类中不能访问外部类的非静态成员.
1. 内部类可以多层嵌套，最内层的内部类可以访问到所有外部类对象的成员变量。
1. 继承非静态内部类时，在该类的构造函数中需要显式的绑定外部类实例，使用这种语法`enclosingClassObject.super()`，其中`enclosingClassOject`
是内部类绑定到的外部类对象，可以通过构造函数参数传入，`super`指该类的父类即内部类，效果和`enclosingClassObject.new InnerClass()`一样。
1. 内部类不能像虚函数一样被覆盖，没有类似多态的机制，子类中的内部类和父类中的同名内部类是不同的类，没有直接关系。
1. 局部类`local inner class`和匿名类一样持有外部类对象的引用，因此功能上是等价的。区别在于匿名类只能创建一个该类对象，而局部类可以重载构造函数而且可以创建
多个类对象。

### Class文件

内部类 生成Class文件，名称为外部类名结内部类名用`$`分割，匿名类名称由编译器决定，一般是数字。

## 装箱拆箱

只发生在基础类型上，不发生在基础类型的复合类型上，比如`int[]`和`Integer[]`不会自动装箱拆箱。

## 数组

1. 效率最高
1. 元素类型有编译是和运行时检查
1. 只有数组能存储原始类型，泛型集合类通过原始类型的自动装箱可以接受原始类型参数，但是内部还是存储为`Object[]`
1. 数组创建后，长度不能变。

### 数组初始化

数组在生成时必须指定类型和长度，数组内部只能保存同种类型的元素。运行时如果向数组中插入不同类型的元素会产生ArrayStoreException。
Java支持多维数组，实际上是一个树形结构的多层间接引用，所以多维数组同一纬度中不同元素指向的下一层数组长度可以不一样，形成锯齿形数组。

```java
public class ArrayInitialization {
    public static void main() {
        // 1. 未初始化局部变量值为null，使用任何未初始化的变量编译器报错。
        Object[] uninitialized;

        // 2. 数组所有元素初始化为null，原始类型初始化为0
        Object[] initializedAsNull = new Object[5];
        int[] initializedAsWithZeros = new int[5];

        // 3. aggregate initialization, trailing comma optional
        Object[] aggregateInitialization = { new Object(), new Object(), };

        // 4. dynamic aggregate initialization, trailing comma optional
        Object[] dynamicAggregateInitialization = new Object[] {
            new Object(),
            new Object(),
        };

        // 5. 二维锯齿形数组 auto boxing
        Integer[][] twoDimensionalRaggedArray = {
            { 1, 2, 3, },
            { 4, 5, 6, 7 },
        };
    }
}
```

### 数组协变(covariance)

数组支持协变，但是数组的元素类型在创建时确定，协变之后仍然只能插入对应类型的元素，否则运行时会抛出`ArrayStoreException`。

```java
public class CovariantArray {
    public static void main(String[] args) {
        Object[] stringArray = new String[] { "first", "second" };

        // ArrayStoreException
        stringArray[0] = new Object();
    }
}
```

### 泛型数组

Java中不允许创建泛型类型数组，因为数组类型创建时有一个默认的元素类型。泛型类型在运行时被擦除为对应的原始类型(raw type)，带有不同
泛型类型参数的泛型类或者接口实例被擦除为同样的原始类或者接口，运行时机制也无法区分不同的泛型类型，因此Java禁止创建泛型数组。

但是Java并不禁止声明泛型数组，因此可以首先创建原始类型数组，然后强制转型为泛型数组类型。

```java
class GenericArray {
    public static void main(String[] args){
        // 编译错误: `Generic Array Creation`
        ArrayList<String>[] genericArray = new ArrayList<String>[0];

        // unchecked assignment: ArrayList[] -> ArrayList<String>[]
        ArrayList<String>[] genericArray = new ArrayList[0];
    }
}
```

### 动态类型

如果无法提前知道具体的泛型类，可以使用`java.lang.reflection.Array.newInstance(Class<?> componentType, int size)`来创建指定类型的数组，第一个参数
代表数组的运行时类型。

```java
import java.util.ArrayList;

public class App {
    static <T> T[] createArray(Class<T> klass, int size) {
        return (T[]) Array.newInstance(klass, size);
    }

    public static void main(String[] args) {
        String[] strArray = createArray(String.class, 0);

        // unchecked assignment
        ArrayList<String>[] genericArray = createArray(ArrayList.class, 0);
    }
}
```

### 与List互转

ArrayList<T>类型内部就是使用了Object[]，并通过`Array.newInstance`转换为类型正确的数组。

```java
public class App {
    public static void arrayAndListConversion() {
        String[] stringArray = { "1", "2" };
        ArrayList<String> test = new ArrayList<>(Arrays.asList("1", "2"));

        /**
         * 1. 不带参数的版本返回Object[]，这种Object[]不能添加其他类型的元素，否则回抛出ClassCastException
         */
        Object[] objArray = test.toArray();

        /**
         * 2.1 但参数的版本返回和参数类型相同的数组，如果参数数组长度小于调用数组test，则返回一个和参数类型相同的新数组，数组元素和
         * test对应位置相同
         * 2.2. 如果参数数组长度能够大于等于test，则将test数组元素复制到参数数组，并返回参数数组。
         */
        test.toArray(new String[0]);
    }
}
```

### 辅助函数

`java.util.Arrays`类提供了`fill`/`sort`/`search`/`compare`/`copy`等一系列辅助函数。

## 泛型

### 泛型基础

泛型的作用有两个：

1. 多个不同类型使用同一份代码，提高代码复用
1. 同时提供编译期的泛型类型安全保证，并自动插入类型转换代码，尽可能避免手动类型转换

#### 类型推导

类型推导算法使用调用实参，目标类型（Target Types)和返回值类型进行推导。

##### 泛型方法调用

泛型会根据实参类型推导泛型参数类型，推导的泛型参数类型是可能的类型范围中最具体的类型。

```java
public class GenericMethodTypeInference {
    public static <T> T pick(T a1, T a2) {
        return a2;
    }

    public static void main(String[] args){
        // 此处推导出T的类型是String/ArrayList<String>两个类型最具体的兼容类型Serializable
        Serializable s = pick("d", new ArrayList<String>());
    }
}
```

##### 泛型类型实例化

在赋值语句中如果右侧是泛型类实例化语句，可以省去泛型参数，只使用`<>`符号（the diamond），这时泛型类的参数类型会通过
左侧类型进行推导，注意不使用`<>`无法触发类型推导。

```java
class App {
    public static void main(String[] args){
        // 类型参数String重复
        ArrayList<String> test = new ArrayList<String>();

        // 省略右边的String类型参数
        ArrayList<String> test = new ArrayList<>();
    }
}
```

对于泛型类，通过一个泛型静态函数作为工厂方法创建对象，可以通过泛型函数类型推导省去手写参数类型。

```java
class Pair<T, U> {
    T first;
    U second;

    private Pair(T first, U second) {
        this.first = first;
        this.second = second;
    }

    public static <T, U> Pair<T, U> of(T first, U second) {
        // 省略类型参数
        return new Pair<>(first, second);
    }

    public static void main(String[] args){
        Pair<String, Integer> pair = Pair.of("first", 2);
    }
}
```

#### 类型擦除(Type Erasure)

Java的泛型只存在于编译时，编译后的代码通过类型擦除移除泛型类型参数。

1. 泛型类/泛型接口/泛型函数定义处的泛型参数声明会保留在字节码中，但是实际使用的泛型参数会被擦除，用类型参数的上下界约束类型替代，如果没有类型约束的话使用`Object`
替代。
1. 在需要的地方添加类型转换代码
1. 在继承泛型基类的子类中生成桥接方法(Bridge Method)以保留多态机制。

```java
class Node<T> {
    public T data;

    public Node(T data) { this.data = data; }

    public void setData(T data) {
        System.out.println("Node.setData");
        this.data = data;
    }
}

class MyNode extends Node<Integer> {
    public MyNode(Integer data) { super(data); }

    @Override
    public void setData(Integer data) {
        System.out.println("MyNode.setData");
        super.setData(data);
    }
}

public class Test {
    public static void main(String[] args) {
        MyNode mn = new MyNode(5);
        Node n = mn;

        // 报错：class java.lang.String cannot be cast other class java.lang.Integer
        n.setData("Hello");
    }
}
```

`MyNode`在继承泛型类`Node<T>`的时候使用`setData(Integer data)`重写(override)了`setData(T data)`，但是类型擦除之后父类`Node<T>`的方法签名
变成`setData(Object data)`其中`T`被`Object`替代。这造成了子类重载的方法签名与父类不一致，重写变成了重载（overload），编译器会为子类
生成一个桥接方法，保证多态成立。

```java
class MyNode extends Node<Integer> {
    public MyNode(Integer data) { super(data); }

    public void setData(Integer data) {
        System.out.println("MyNode.setData");
        super.setData(data);
    }

    // 生成的桥接方法
    public void setData(Object data) {
        // 强制转型为Integer
        return setData((Integer) data);
    }
}
```

泛型类方法有泛型类型变长参数的时候会提示可能出现"Heap Pollution"，因为变长参数会被转换为数组类型处理，而泛型数组类型在类型擦除的时候
变成原始数组类型，丢失了泛型信息，所以无法区分两个不同类型的泛型数组，运行时可能出现元素类型不一致的问题。在确保类型正确的情况下，可以
使用`@SafeVarags`注解关闭报警提示。

### C# 泛型协变与逆变

1. 协变(covariance)
1. 逆变(contra-variance)
1. 不变(invariance)

### 通配符

数组支持类型协变，因为有运行时机制保证插入数组的元素类型相同。自定义的泛型类没有这个运行时机制的保证，所以泛型不支持协变。但是Java通过
通配符支持泛型协变。

Producer Extends Consumer Super原则

`? extends T`上界约束: 泛型类的函数中可以安全读取T类型的对象，不允许写入。
`? super T`下界约束： 泛型类型函数中可以安全写入T类型的对象，不允许读。
`?` 无界限定符： 只能读取Object类型的对象，写入null值。

![通配符泛型子类型关系](./generics-wildcard-subtyping.gif)

```java
interface List<E> {
    E get(int index);

    /*
    * 添加元素时要求元素类型必须是E
    */
    void add(int index, E element);

    E set(int index, E element);

    /*
    * indexOf函数用相等性检测搜索元素位置，相等性比较不要求参数类型为E，可以检测任意类型的参数因此选择Object类型作为参数。
    */
    int indexOf(Object o);
}
```

1. `? extends Apple` 上界限定
1. `? super Apple` 下界限定
1. 使用在泛型函数中`<T> void copy(List<? super T> from, List<? extends T> other)`

1. 通配符只支持单个约束（single bound)
1. 通配符不能使用在泛型类定义的泛型参数中，可以用在泛型实例化类型声明中。


```java
class App {
    // 1. compile error
    // interface List<? extends Apple> {}

    public static void main(String[] args){
        // 2
        List<? extends Apple> type;
    }

    // 3
    public <T> void accept(List<? extends T> list) {

    }
}
```

### 无限定通配符(Unbounded Wildcard)

无界通配符通常使用在两种情况

1. 方法的功能只用`Object`类提供的函数就能完成，因为`Object`是所有类的基类，其功能总是可用的，此时使用无界通配符来接受任意泛型参数类型的入参。
1. 方法的功能不用知道泛型参数的具体类型就能实现，例如`List.size()`/`List.clear()`。`Class<?>`使用非常广泛就是因为`Class`的大部分函数不依赖于泛型参数`T`。

```java
class App {
    static List list1;
    static List<?> list2;
    static List<? extends Object> list3;

    public static void main(String[] args){
        list3 = list1;
    }
}
```

1. `List` - a raw **List** that holds any **Object** type
1. `List<?>` - a non-raw **List** of _some specific type_, but we just don't know that that type is.
1. `List<? extends Object>`
1. `List<Object>`

### 捕获转换(Capture Conversion)

通配符泛型类型 `List< ?>`接受任何`List`类型的值，因此编译器对`List< ? >`进行类型检查时，其中`?`代表的具体类型是未知的。但是编译器可以确定的是对于一个`List< ?>`类型的参数，
其运行时类型是确定的。在编译时，编译器对于`List< ?>`类型变量赋值给`List< T>`进行类型检查时，发生捕获转换，将`List< ?>`
中`?`代表的具体类型标记为`CAP#1`符号，其意义在于`CAP#1`在类型推导时可以作为具体的类型使用，因此`List<T>`类型中`T`被推导
为`CAP#1`。

这个过程的关键在于将`?`代表的未知类型(unknown type)转换成一个已知的具体类型`CAP#1`，虽然不知道`CAP#1`代表的真实类型，但是`CAP#1`可以
使用在多个地方，而保证所有使用的地方类型相同。类型一致保证是编译器保证类型安全的一个方法。

考虑列表反转函数的例子，列表反转的操作并不关心列表元素的具体类型，而只要求列表元素是同一个类型即可。所以参数类型应该使用`List< ?>`用来
接受所有类型列表。反转时先复制一个相同的列表，然后反向将元素填充到原列表中。但是有一个问题，`List< ?>`的`get`方法拿出来的只能是`Object`
类型的变量，`set`方法却只能接受空指针，类型检查不通过，无法重新将元素放入。

```java
class App {
    public static void reverse(List<?> list) {
        List<?> tmp = new ArrayList<>(list);

        for (int i = 0; i < list.size(); i++) {
            Object current = tmp.get(list.size() - i - 1);

            // error，使用无界通配符的set函数只能接受null，不接受Object类型
            list.set(i, current);
        }
    }
}
```

我们知道两个列表中的元素类型是一样的，反转操作实际是类型安全的，但是编译器并不知道这一信息，因此产生编译错误。捕获转换机制能够为编译器提供这一信息。


函数`void reverse(List<?> list)`调用辅助函数`<T> void reverseHelper(List<T> list)`，编译器类型检查时在此处发生捕获转换，`?`类型
被标记为`CAP#1`，然后`T`类型被推导为`CAP#1`。在`reverseHelper(List<T> list)`中由于两个列表元素类型都是`CAP#1`，因此反转操作在编译器
看来是类型安全的。

```java
class App {
    public static void reverse(List<?> list) {
        /*
        * List<?>赋值给List<T> 此处发生捕获转换
        */
        reverseHelper(list);
    }

    public static <T> void reverseHelper(List<T> list) {
        List<T> tmp = new ArrayList<>(list);

        for (int i = 0; i < list.size(); i++) {
            T current = tmp.get(list.size() - i - 1);
            list.set(i, current);
        }
    }
}
```

总的来说，编译器使用捕获转换为使用统配符的泛型类制提供类型一致性保证，使得原本类型安全的操作能够编译通过。

捕获转换的细节参考以下材料。

1. [Wildcard Capture And Helper Methods](https://docs.oracle.com/javase/tutorial/java/generics/capture.html)
1. [JAVA SE Spec Capture Conversion](https://docs.oracle.com/javase/specs/jls/se7/html/jls-5.html#jls-5.1.10)

### 泛型类型使用限制

1. 基本类型不能作为泛型参数，要使用对应的包装类。基本类型的复合类型不会自动装箱拆箱。
1. 参数化泛型类型和泛型类型参数`T`错误使用。
    ```java
    class GenericTypeParameterWrongUsage {
        public static <E> void rtti(List<E> list) {
            // compile-time error
            if (list instanceof ArrayList<Integer>) {
            }

            // compile-time error
            if (list instanceof E) {
            }

            // compile-time error
            Class<?> klass = E.class;

            // compile-time error
            Class<?> klass = ArrayList<Integer>.class;
        }
    }
    ```
1. 不能使用关键字`new`创建泛型参数类型对象
    ```java
    class NoNewGenericType {
        public static <E> void append(List<E> list) {
            // compile-time error
            E elem = new E();
            list.add(elem);
        }

        public static <E> void append(List<E> list, Class<E> cls) throws Exception {
            E elem = cls.newInstance();
            list.add(elem);
        }
    }
    ```
1. 因为异常的类型要在编译器完全确定，所有不能创建泛型异常，不能catch/throw泛型参数类型对象，
    ```java
    class App {
        // compile-time error
        // Extends Throwable indirectly
        static class MathException<T> extends Exception {}

        // compile-time error
        // Extends Throwable directly
        static class QueueFullException<T> extends Throwable {}

        public static <T extends Exception, J> void execute(List<J> jobs) {
            try {
                for (J job : jobs) {}
            // compile-time error
            } catch (T e) {
            }
        }

        static class Parser<T extends Exception> {
            // OK
            public void parse(File file) throws T {
                // ...
            }
        }
    }
    ```
1. 不能创建泛型数组
1. 类静态Field不能使用泛型参数，应为静态对象属于所有参数化泛型类共有，因此不能使用泛型参数。
1. `List<String>.class`无效，类型被擦除，使用非泛型版本`List.class`
1. 手动downcast的时候，编译器提示`unchecked exception`，使用`List.class.cast(Object o)`将对象cast到`List`类型不会报`unchecked exception`，
因为`cast`函数内部使用手动转型，并已经使用`@SuppressWarning("uncheck")`关闭`unchecked exception.
1. 函数泛型类型参数中，泛型名字不属于函数签名，不能用来重载函数。
1. 不能在父类和子类实现同一个泛型接口的不同实例。如果基类实现了某个具体的泛型接口，子类实现该泛型接口时函数参数类型必须与父类一致，称之为基类劫持泛型接口。

### 自限定类型(Self Bounded Types)

自限定类型或者接口如`class Enum<T extends Enum<T>>`，继承了自限定父类或者实现了自限定接口的类型`class Child extends Enum<Child>`可以实现函数参数类型
和子类相同。

```java
interface SelfBounded<T extends SelfBounded<T>> {
    void show(T t);
}

public class Child implements SelfBounded<Child> {
    // 接口参数可以使用实现类的类型Child，达到协变的效果
    @Override
    public void show(Child child) {
    }
}
```

### 动态类型安全(Dynamic Type Safety)

如果只使用泛型接口和泛型类，编译器能保证编译和运行时的类型安全。但是如果混用泛型类和对应原始类，不管有意还是无意，很容易通过手动类型转换在运行时打破类型安全。

将泛型类型`ArrayList<String>`转换为原始类型`List`，添加元素时如果忽略了`unchecked exception`，那么获取元素时很可能因为元素类型不对抛出`ClassCastException`。
如果代码中所有的`unchecked exception`被正确处理，即可避免出现运行时错误。

```java
class BreakTypeSafety {
    public static void main(String[] args){
      List list = new ArrayList<String>();

      // warning: unchecked exception
      list.add(new Object());

      // ClassCastException
      String s = (String) list.get(0);
    }
}
```

Java的原始集合类`Collection`/`List`/`Set`/`Map`提供了对应的运行时类型安全版本`CheckedCollection`/`CheckedList`/`CheckedSet`/`CheckedMap`。
通过`Collections`类型已`checked`开头的一系列泛型静态函数可以获得对应**运行时类型安全**的集合类型。类似数组的运行时元素类型检查。

```java
class Collection {
    public static <E> Collection<E> checkedCollection(Collection<E> c, Class<E> type) {
        return new CheckedCollection<>(c, type);
    }
}
```

**运行时类型安全**的集合类在构造时接受一个或者多个`Class<T>`类型参数，记录集合元素的类型。集合类的所有写入操作使用`typeCheck`函数做类型
检测，类型不符合直接抛出`ClassCastException`异常。

```java
class CheckedCollection<E> {
        public boolean add(E e) {
            return c.add(typeCheck(e));
        }

        @SuppressWarnings("unchecked")
        E typeCheck(Object o) {
            if (o != null && !type.isInstance(o))
                throw new ClassCastException(badElementMsg(o));
            return (E) o;
        }
}
```

原始类型集合在读取元素的时候才会发现元素类型不符合，这个时候很难去查找到底是那个地方加入了其他类型的元素。运行时类型安全集合在元素插入时就进行
类型检查，保证元素类型一致。一般在与使用原始集合类型的代码对接而又必须保证元素类型一致时使用。

## 异常

Java中所有异常类型实现了`Throwable`接口

`Exception`和`Error`实现了`Throwable`，`Error`表示系统错误错误。

`Exception`/`Error`/`RuntimeException`三个类在构造时有一个构造函数，接受另一个`Throwable`对象记录异常触发原因。所有其他类型的异常使用`initCause`方法指定异常原因。

`RuntimeException`继承`Exception`，在程序由于编写错误造成bug的地方，抛出`RuntimeException`异常，用来提示逻辑有误，应当修改。
常见的是`NullPointerException`/`ArrayIndexOutOfBoundsException`等，这时调用方应该保证入参正确，以避免这些异常。没有捕捉的`RuntimeException`会传递到最外层`main`函数，
导致程序错误并停止。

异常约束（Exception Restriction)指函数签名中使用`throws`关键字标识可能抛出的异常类型。其中`Exception`及其除了`RuntimeException`之外的其他子类异常属于
checked exception；`RuntimeException`和`Error`属于`unchecked exception`。 无论`thorws`关键字是否显式指明，`unchecked exception`都允许在函数中抛出。
函数可能抛出所有`checked exception`必须在异常约束中指明，但是对于所有指明可能抛出的`checked exception`，并不一定抛出。

在实现接口函数或者重写(override)父类
的函数时，子类的函数的异常约束必须小于等于父类的异常约束，允许收缩，不允许放宽。考虑函数抛出的异常跟函数返回值一样，属于函数的输出，在重写父类函数时，返回值类型允许是
父类函数返回值类型及其子类，类型只能缩小，不能放大。里氏替换原则：在任何需要父类函数的地方，覆盖的子类函数应当都能够替代使用，这要求子类函数的输出返回要被包含在
父类函数的输出范围内，这样所有之前使用到父类函数的代码逻辑才能保证兼容。另外跟函数返回值类型一样，异常约束不属于函数签名的一部分，因此不能用不同的异常约束对函数进行重载。


使用了抛出`checked exception`的外层函数必须对`checked exception`进行处理。

1. 无法处理该异常时，指明可抛出同类型的`checked exception`从而将异常传递到更外层。
2. 可以处理该异常时，使用`try catch`块捕捉异常并进行处理。

`checked exception`如果没有正确处理，会产生编译错误。

异常使用时遵顼三个原则：

1. 明确类型： 不同类型的错误使用不同的子类型表示。
1. 提早抛出： 在流程出错的起始的地方及时抛出异常，此处包含异常原因最完整的信息，在程序出错时能够快速定位错误位置和原因。
1. 延迟捕捉： 异常的处理应该是分层次的，对于本层能够处理的进行捕捉处理；对于无法处理的，可以转发到上层有处理能力的地方进行处理，如果该异常属于内部实现细节，不需要让外部
了解，可以将其包装到另外的异常类型中，并作为包装异常的原因(cause)，将包装异常向上层抛出。不应该在没有处理能力的时候提早捕捉异常，而是将异常抛出，延迟捕捉到最外层有能力
处理的地方。尤其不要提早捕捉了异常并且使用空的`catch`块，这样该异常信息会被吞掉，但是已经出错的流程并没有被修复，甚至因为缺少异常信息而无法修复。

对比Exception和Error Code

1. Error Code要求函数有返回值或者没有返回值时必须使用某个入参存储错误返回值。
1. Error Code不方便向上层传递，因此需要在本层进行处理，或者大多数情况下因为处理起来麻烦而被忽略。
1. 多个同类型的Exception可以使用同一个`catch`进行处理，减少冗余代码。

`checked exceptions` 缺陷参考

1. https://stackoverflow.com/questions/124143/why-are-exceptions-not-checked-in-net
1. [Why doesn't C# Has Exception Specifications](http://msdn.microsoft.com/en-us/vcsharp/aa336812.aspx)
1. [The Trouble with Checked Exceptions](https://www.artima.com/intv/handcuffs.html)
1. [Does Java Need Checked Exceptions](http://www.mindview.net/Etc/Discussions/CheckedExceptions)

TODO:

1. 异常还是返回`null`？
1. 子类构造函数可以扩大父类构造函数规定的异常范围，构造函数如果能够抛出异常，并且需要在构造成功/失败后进行资源清理的，注意使用`finally`块手动进行清理。

## RTTI

Java类的类型信息运行时用`Class`的对象表示，每个Java类在第一次引用该类的静态成员时由`ClassLoader`加载并创建对应的`Class`对象。
类的构造函数也属于类静态成员。

使用`Class.forName("java.lang.Integer")`运行时动态获取`Class`对象，`Class.forName`会导致类进行**静态初始化**。


使用`Integer.class`获得类`java.lang.Integer`对应的`Class`对象，在编译期会进行类型检查，所以字面值的类名不需要全限定名，同时只会
加载二进制.class文件创建`Class`对象，不会触发**静态初始化**。

```java
public class App {
    public static void main(String[] args) {
        // 如果找不到类，抛出ClassNotFoundException
        Class.forName("java.lang.Thread");

        // true
        int.class == Integer.TYPE;
        // false
        Integer.class == int.class;
        // false
        Integer.class == Integer.TYPE;
    }
}
```

对于泛型`Class<T>`在编译时会提供额外的类型检查。

```java
public class GenericClassReferences {
    public static void main(String[] args) {
        Class intClass = int.class;

        // 原始类型int不能作为泛型参数使用，自动使用对应包装类型Integer
        Class<Integer> genericIntClass = int.class;
        genericIntClass = Integer.class;

        // Class类型的对象可以赋值给不同的class
        intClass = double.class;

        // 编译错误，泛型Class<Integer>不能赋值不同类型的Class
        genericIntClass = double.class;
    }
}
```

Java中有三个地方涉及到了运行时类型信息：

1. `(Child) Parent`显式类型转换时会进行运行时类型信息检查，如果运行时类型不符合会抛出`ClassCastException`。
1. `Class`对象获取类运行时信息。
1. `o instanceof ClassName` 检查对象`o`是否是类`ClassName`的实例，其中`ClassName`类型在编译时就要确定。
1. `Class.isInstance()`函数可以在运行时检查，一般不使用原始类型的`Class`对象。
    ```java
    class InInstance {
        public static void main(String[] args) {
            // false: 原始类型自动装箱
            int.class.isInstance(1);
            // false
            int.class.isInstance(Integer.valueOf(1));

            // true: 原始类型自动装箱
            Integer.class.isInstance(1);
            // true
            Integer.class.isInstance(Integer.valueOf(1));
        }
    }
    ```

### 动态代理 (Dynamic Proxy)

## Enum

## String

字符串字面量(String Literal)和值是字符串的常量表达式(string-valued constant expression)的值在编译时就能确定，会被
放在一个字符串常量池中，字符串常量池中每个内容的字符串对象只有一个，这种行为叫做`intern`。通过`new String()`是直接在堆内存
创建新的字符串对象，和常量池中对象无关。可以使用`str.intern()`函数可以强制获取字符串常量池中的字符串对象引用，
如果常量池中还没有改字符串会先添加，然后返回。

```java
public class StringTest {
    public static void main(String[] args){
        String s1 = "hello";
        String s2 = "world";
        String s3 = "hello" + "world";
        String s4 = "helloworld";
        String s5 = new String("hello") + "world";
        String s6 = new String("hello") + "world";

        // true
        System.out.println(s3 == s4);
        // false
        System.out.println(s3 == s5);
        // false
        System.out.println(s5 == s6);
        // true
        System.out.println(s3 == s5.intern());
        // true
        System.out.println(s5.intern() == s6.intern());
    }
}
```
