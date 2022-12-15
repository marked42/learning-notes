# 条件

条件选择语句（if/else/switch）可能存在的问题

1. 条件分支写死在代码中，无法运行时动态修改
1. 单个条件分支逻辑复杂，代码行数很多

## 合并条件

1.  decompose conditional
1.  Consolidate Conditional
1.  Replace Nested with Guard 使用 Guard Clause 语句简化条件，提早退出。
1.  introduce assertion
1.  avoid negative 尽量使用正向的条件

```ts
if (length >= 10) {}
if (10 <= length>) {}

while (bytes_received < bytes_expected) {}
while (bytes_expected > bytes_received ) {}

// yoda
if (obj = NULL) {}
if (obj == NULL) {}
if (NULL == obj) {}
```

## Order of if/else blocks

1. 提前返回，先处理简单情况
1. 尽量避免负向条件
1. 先处理核心逻辑

## Replace Conditional with Polymorphism

适合有多个方法需要同样一个条件选择逻辑的情况，多个方法提取为一个基类，每个条件分支对应一个子类。

1. type code/switch case/if 分支特别多，每个分支代码也很多的情况下
1. inheritance 形式。使用 replace type code with polymorphism，可以将每个分支代码封装在单独类中，类的个数和分支数相同。

## Replace Type Code with Sub Classes

## Replace Conditional with Strategy

应用场景

1. 运行时切换 对于同一个问题切换不同的策略
1. 很多相似的类，区别在于类的某些行为不同，使用策略模式减少类个数。

1. composition 形式。使用策略模式（Strategy），将不同分支代码封装在不同的策略类中，策略类可以*运行时*修改，隔离 context 和 strategy
1. 在 context 和 strategy 类中的数据传参策略。直接传数据，或者传整个 context 类实例

## Replace State-Altering Conditionals with State

针对比较复杂的状态改变条件逻辑。

需要一个前端状态转换的典型场景例子 Promise 有状态，太简单

client + context + state

好处

1. 拆分不同状态的代码
1. 方便增加新的状态

TODO: TDD Pluggable Object
https://github.com/lecepin/blog

图片编辑单选、多选模式实现。

## Replace Conditional Dispatcher with Command

重构手法
Replace Function with Command/Replace Command with Function

多数情况下函数形式够用了，在函数逻辑特别复杂，需要拆分的情况下考虑重构为命令对象（command object）

这个模式对于 Java 等面向对象语言更有必要，因为函数不能独立存在，只能作为对象方法存在。
JS 中可以使用嵌套函数和闭包实现等价效果。

命令对象的形式相比于函数要灵活，可以将函数拆分为多个阶段分别执行，保存中间状态，支持相关操作例如 undo。

命令模式

例子 Editor copy/paste/cut/undo/redo

```java
public void display() {
    switch (getType()) {
        case RECTANGLE:
            break;
        case OVAL:
            break;
        case TEXT:
            break;
        case DEFAULT:
            break;
    }
}
```

```java
public Money calculatePay(Employee e) {
    switch (e.type) {
        case COMMISSIONED:
            return calculateCommissionPay(e);
        case HOURLY:
            return calculateHourlyPay(e);
        case SALARIED:
            return calculateSalariedPay(e);
        default:
            return new InvalidEmployeeType(e)
    }
}


public abstract class Employee {
    public abstract boolean isPayday();
    public abstract Money calculatePay();
    public abstract void deliveryPay(Money pay);
}

public interface EmployeeFactory {
    public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType;
}

public class EmployeeFactorImpl implements EmployeeFactory {
    public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType {
        switch (r.type) {
            case COMMISSIONED:
                return new CommissionedEmployee(w);
            case HOURLY:
                return new HourlyEmployee(k);
            case SALARIED:
                return new SalariedEmployee(r);
            default:
                throw new InvalidEmployeeType(e.type)
        }
    }
}
```

## 参考

1. Clean Code Switch Statements P37
1. Implementation Patterns Chapter 5 Page 36
   1. Instance-Specific Behavior
   1. Conditional
   1. Delegation
   1. Pluggable Selector
1. The Art of Readable Code Chapter 7 Making Control Flow Easy to Read
1. Design Patterns Visitor
