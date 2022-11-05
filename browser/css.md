# CSS 解析

样式匹配 对于每一个 DOM Node 区所有的 CSS Style 进行匹配

对于逗号分隔的多个 Selector 匹配 DOM 节点时选用优先级（Specificity）最高的选择器，可以在解析 CSS 规则时将选择器按照优先级从高到底排序，
这样第一个匹配的选择器就是所有匹配的选择其中具有最高优先级的。

优先级的匹配，单个选择其中的标签（Tag）、ID 和所有类（class）必须都匹配。

找到 DOM 节点所有匹配的 CSS 规则后，按照优先级从低到高排序，对每个 CSS 规则中的属性进行计算，同名的属性，优先级高的规则排在后边会覆盖优先级低的规则中的属性值。

对 DOM 树中的所有 DOM 节点进行样式匹配构建样式树（StyleTree）。

1. [Cascade 规则](https://www.w3.org/TR/CSS2/cascade.html#cascade)，样式优先级，根据样式来源，origin。
1. 没有样式规则匹配到的 DOM 节点对应的样式属性使用默认值
1. 对于文字节点等无法声明样式的节点，其样式属性继承父节点属性
1. [specified, computed, actual values](https://www.w3.org/TR/CSS2/cascade.html#value-stages)
1. 内联样式
1. https://kittygiraudel.github.io/selectors-explained

[Specificity](https://specifishity.com/)
[Cascading and Inheritance](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Cascade_and_inheritance#specificity_2)
[Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)

资料

1. [Tali Garsiel's Site](http://taligarsiel.com/Projects/howbrowserswork1.htm)
1. [Client Side Performance](http://taligarsiel.com/ClientSidePerformance.html)
   [Assigning Property Values](https://www.w3.org/TR/CSS2/cascade.html)
1. [Processing Model](https://www.w3.org/TR/CSS21/intro.html#processing-model)

1. https://web.dev/learn/css/

1. [W3C ORG Visual Formatting Model](https://www.w3.org/TR/CSS21/visuren.html#inline-boxes)
1. [WHATWG CSS Display Module Level 3](https://drafts.csswg.org/css-display/#block-formatting-context)
