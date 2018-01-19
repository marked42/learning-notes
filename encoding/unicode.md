# Unicode

## ASCII与ISO-8859-1

ASCII全称为 **A**merican **S**tandard **C**ode for **I**nformation **I**nterchange(美国标准信息交换码), 字符集中每个字符使用7个二进制位(bit)表示, 因此能够表示128个字符. 其中有0 ~ 31与127总共33个控制字符(control character), 32 ~ 126包括空格(32), 字母, 数字以及英文标点符号.

 ![ascii](./ascii.png)

ISO-8859-1字符集对ASCII字符进行扩展, 将最高位利用起来, 使用8位表示一个字符. 但是新增的128字符中前32个(0x80 - 0x9F)与ASCII类似进行保留, 因此只增加了 96个字符, 主要是有重音(diacritics)符号的拉丁文, 因此又被称为 Latin-1字符集.

 ![latin1](./latin1.png)

## Code Page

为了支持英语以外的语言文字, Windows系统采取了代码页([Code Page](https://en.wikipedia.org/wiki/Code_page))的方案. 每个代码页是一个类似ISO-8895-1的编码方案, 对应为某个国家或者地区的文字, 在0 ~ 127的范围内和ASCII兼容, 在128 ~ 255的范围内为对应区域的文字编码. 

不同语言Windows的系统默认使用不同的代码也来支持相应语言文字. Windows系统内有两类代码页ANSI和OEM代码页. ANSI代码页应用于Window桌面应用程序, 代码范围为874 ~ 1258. OEM代码页最初有IBM设计, 应用于Windows console中, 代码范围437 ~ 874.

但是这样的代码页还是使用单字节来表示一个字符, 被称为单字节字符集([**S**ingle-**B**yte **C**haracter **S**et](https://en.wikipedia.org/wiki/SBCS)). 单字节字符接对于英语等字符个数少于256个的语言是合适的, 但是无法表示中日韩等字符个数较多的亚洲国家的语言文字. 对应的出现了使用两个字节的双字节字符集([**D**ouble-**B**yte **C**haracter **S**et](https://en.wikipedia.org/wiki/DBCS)), 也被称作多字节字符集([Multi-byte Character Set](https://en.wikipedia.org/wiki/Variable-width_encoding#MBCS)).

| 代码页    | 语言       |
| :----- | -------- |
| cp932  | 日文       |
| cp936  | 简体中文GBK  |
| cp949  | 韩文       |
| cp950  | 繁体中文Big5 |
| cp1252 | 法国       |

在Windows系统DOS窗口下可以使用命令`chcp`来对代码页进行设置.

```bacth
chcp        //不带参数调用查看当前代码页
chcp 1252   //设置代码页为1252
```

但是代码页对于多语言的支持还存在一个问题, 不同国家的语言文字不能混用, 因为同一个代码页只能对应一个国家的语言文字. 代码页的方式已经不推荐使用, 我们需要一个能够表示所有国家语言文字的字符集, 这就是Unicode字符集.

## Unicode

Unicode字符集全称Universal Coded Character Set (UCS),  1988年8月 Joe Becker发布了Unicode的第一个草稿, 他解释说Unicode的名字代表了unique(唯一), unified(统一), universal(通用) 三个意思.

### 码点

Unicode为每个字符提供唯一的编号, 叫做码点(Code Point). 下面是从[Wiki](https://en.wikipedia.org/wiki/Unicode)上摘抄的简短说明:

> In text processing, Unicode takes the role of providing a unique *code point*—a [number](https://en.wikipedia.org/wiki/Number), not a glyph—for each character. In other words, Unicode represents a character in an abstract way and leaves the visual rendering (size, shape, [font](https://en.wikipedia.org/wiki/Font), or style) to other software, such as a [web browser](https://en.wikipedia.org/wiki/Web_browser) or [word processor](https://en.wikipedia.org/wiki/Word_processor).

Unicode的码点表示为U+[XX]XXXX, X表示一个16进制数字. 码点有4-6位, 不足4位的码点高位用0补齐4位, 超过4为的码点不做处理, 例如 U+0048(4位补0), U+1D11E(5位), U+10FFFF(6位).  Unicode标准规定码点范围为U+0000 ~ U+10FFFF, 因此最大可以表示1114112个字符.

为了方便管理码点被划分成17个平面, 每个平面都是256×256的表格, 可以表示65536个码点. 第一个平面Plane 0被称作基本多语言平面(**B**asic **M**ultilingual **P**lane ), 包括码点范围U+0000 ~ U+FFFF. 第一个平面内的字符只需要两个字节即可进行编码, 这也是最初的Unicode标准的全部表示范围. 后来Unicode进行了扩展, 后面的16个平面被称作增补平面(**S**upplementary **P**lanes).

所有Unicode字符被划分为不同的类别(Categories), 每个类别还划分为若干个子类别, 具体列表如下:

| Category       | Subcategory                              |
| -------------- | ---------------------------------------- |
| Letter(L)      | Lowercase(Ll), modifier(Lm), titlecase(Lt), uppercase(Lu), other(Lo) |
| Mark(M)        | spacing combining(Mc), enclosing(Me), non-spacing(Mn) |
| Number(N)      | decimal digit(Nd), letter(Nl), other(No) |
| Punctuation(P) | connector(Pc), dash(Pd), initial quote(Pi), final quote(Pf), open(Ps), close(Pe), other(Po) |
| Symbol(S)      | currency(Sc), modifier(Sk), math(Sm), other(So) |
| Separator(Z)   | line(Zl), paragraph(Zp), space(Zs)       |
| Other()        | Control(Cc), format(Cf), not assigned(Cn), private use(Co), surrogate(Cs) |

### Unicode等价性

Dynamic Composition

为了和已有标准相容, 某些被称为组合字符([precomposed character](https://en.wikipedia.org/wiki/Precomposed_character))的特殊字符可以表示成两种形式, 单一的码点或者多个码点组成的序列, 这叫做Unicode等价性([unicode equivalence](https://en.wikipedia.org/wiki/Unicode_equivalence)). 常见的有带重音字符([diacritical mark](https://en.wikipedia.org/wiki/Diacritic))字符和连字([ligatures](https://en.wikipedia.org/wiki/Typographic_ligature)). 例如:

1. 带重音符号字母é可以表示成单个字符U+00E9(带有尖音符号的小写拉丁字符e), 也可以表示成字符序列U+0065(小写拉丁字母e)和U+0301(尖音符号).
1. 单个字母ff(小写拉丁连字ff, U+FB00), 和两个连续的小写拉丁字母f(U+0066U+0066)等价.

Unicode对于组合字符提供了两种等价概念: 标准等价(canonical equivalence)和相容等价(compatibility equivalence).

> Code point sequences that are defined as **canonically equivalent** are assumed to have the same appearance and meaning when printed or displayed.
>
> 符合标准等价一串字符序列在打印或者显示时具有**相同的外观与功能**.

上面列举的带重音符号的字母的两种形式就是标准等价.

> Sequences that are defined as **compatible** are assumed to have possibly distinct appearances, but the same meaning in some contexts
>
> 相容等价的字符可能具有**不同的外观**, 但是所表示的字符是相同的.

上面列举的连字的例子就属于相容等价.

为了判断组合字符的等价性, Unicode规定了四种等价形式, 可以选择将字符或者字符序列转换成相同的形式来判断其等价性. 正规形式(normalization)及其算法如下表.

| Type                                     | Algorithm                                |
| ---------------------------------------- | ---------------------------------------- |
| **NFD** Normalization Form Canonical Decomposition | 以标准等价方式来分解                               |
| **NFC** Normalization Form Canonical Composition | 以标准等价方式来分解，然后以标准等价重组之。若是singleton的话，重组结果有可能和分解前不同。 |
| **NFKD** Normalization Form Compatibility Decomposition | 以相容等价方式来分解                               |
| **NFKC** Normalization Form Compatibility Composition | 以相容等价方式来分解，然后以标准等价重组之。                   |

详细的信息请参考[wiki unicode equivalence](https://en.wikipedia.org/wiki/Unicode_equivalence).

### UTF

UTF全称Unicode转换格式(**U**CS **T**ransformation **F**ormat), Unicode字符集只规定了字符对应的码点, 字符与码点是一对一的关系. UTF 为唯一的字符或者说码点提供在二进制位层面的编码方式, 具体包括 UTF-8, UTF-16 和 UTF-32.

ASCII与ISO-9985-1等字符集只对应一种字符编码方式, 因此字符集(character set)与字符编码(character encoding)的概念不做区分.  但是Unicode字符集有三种字符编码UTF-8/UTF-16/UTF-32, 每种字符编码使用不同的二进制数据代表同一个Unicode字符.

字符编码使用固定长度的代码单元(Code Unit)对字符进行编码, UTF-8, UTF-16 和 UTF-32 的代码单元分别是8位, 16位和32位. 字符编码对字符集中所有字符进行编码时, 每个字符所需要的代码单元数目可能相同也可能不同. 所有字符需要的代码单元数目相同的编码方式被称为**定长编码**(fixed-width), 不同字符需要的代码单元数目不同的编码方式被称为**变长编码**(variable-width).

| 编码     |  宽度  | 说明                                       |
| :----- | :--: | :--------------------------------------- |
| UTF-32 |  定长  | 使用一个代码单元(32位)即可对所有Unicode字符进行编码, 高位用0补齐为32即可. 码点与编码字节内容一一对应. 这种编码方式优点在于查找效率高, 时间复杂度为`O(1)`, 缺点在于空间利用率低, 是相同内容的ASCII编码的四倍长度, 因此实践中较少使用. |
| UTF-8  |  变长  | 使用1 ~ 4 个代码单元(8位)对Unicode字符进行编码, 字符搜索时间复杂度为`O(n)`, 但是编码效率比较高, 是网络传输及存储使用最多的编码方式 |
| UTF-16 |  变长  | 使用1 ~ 2 个代码单元(16位)对Unicode字符进行编码, 是UTF-8与UTF-32的折中方式, 内存操作效率比UTF-8高, 因此在程序中使用频繁. |
| UCS-2  |  定长  | 早期Unicode提出的编码方式, 属于UTF-16的一个子集, 只能对U+000 ~ U+FFFF范围内的码点进行编码, 已废弃. |
| UCS-4  |  定长  | 早期Unicode提出的编码方式, 功能上与UTF-32相同.          |

UTF编码还包括UTF-1, UTF-7 和 UTF-EBCDIC三种方式, 不是很常用, 详细信息可参考[Wiki](https://en.wikipedia.org/wiki/Unicode#cite_note-Glossary-5).

### [UTF-8](https://en.wikipedia.org/wiki/UTF-8)

UTF-8变长编码方案中一个字符编码长度可能为四种情况, 分别是1,2,3,4个字节. 具体的编码方式如下:

| 编码长度(字节) | 二进制编码                                 | 有效位数 |        码点范围        |
| :------: | ------------------------------------- | :--: | :----------------: |
|    1     | `0XXXXXXX`                            |  7   |  U+0000 ~ U+007F   |
|    2     | `110XXXXX 10XXXXXX`                   |  11  |  U+0080 ~ U+07FF   |
|    3     | `1110XXXX 10XXXXXX 10XXXXXX`          |  16  |  U+0800 ~ U+FFFF   |
|    4     | `11110XXX 10XXXXXX 10XXXXXX 10XXXXXX` |  21  | U+10000 ~ U+1FFFFF |

#### 编码方案讨论

UTF-8编码中任意取出一个字节`xxxxxxxx`如果确定这个字节这个字节属于那种长度的编码? 不同长度的变长编码之间应该如何区分呢? 

首先单字节编码与ASCII字符集兼容, 最高位为0, 因此取出任意一个最高位为0的字节即可断定它属于单字节编码.

 其次为了和单字节编码进行区分, 其余编码中每个字节最高位都必须为1, 形如`1XXXXXXX`. 这时第二高位有0和1两种选择, 如果最高两位`10`和`11`的二进制编码都允许的话, 那么给定任意字节将无法在剩余三种编码中进行区分. 而且只能选择`10`作为区分标志. 后续3, 4字节编码如果想要区分只能增加1的个数, 如果选择`11`作为区分标志, 那么`11XXXXXX`与`111XXXXX`之间是无法区分的, 因为`11XXXXXX`中后六位为有效编码为, 其中的最高位既可以为0也可以为1. 至此得到第二个正确的编码形式`10XXXXXX`, 后续只要增加前导1的个数即可在给定任意字节的情况下判定它属于1, 2, 3, 4字节变长编码的哪一种. 

最后, 其实不需要做到给定任意单个字节即可判断其变长编码方式, 只需要在顺序解码的情况下, 能够区分连续的若干个字节属于那种编码方式即可. 最终的得到正式的UTF-8变长编方式, 复用了`10XXXXXX`的形式, 作为2, 3, 4字节编码中除去第一个字节外其余字节的编码形式, 同时第一个字节采用最高位增加1的个数的方法相互区分. 这样给定`10XXXXXX`形式的单个字节, 虽然无法判断它属于2, 3, 4字节编码中的哪一种, 但是对于连续字节流, 我们能够对区分2, 3, 4字节编码. 最终2, 3, 4字节编码第一个字节最高位分别以2, 3, 4个1后接一个0作为区分标志.

值得注意的是4字节编码最大码点为U+1FFFFF, 因此4字节UTF-8编码就可以对Unicode规定的所有码点U+0000 ~ U+10FFFF进行编码. 起始最初的提案中还包括了5, 6字节编码, 但是32字节的UTF-16编码的最大码点就是U+10FFFF, 因此正式标准去除了5, 6字节编码的部分. 5, 6字节编码形式如下:

| 编码长度 | 二进制编码                                    | 有效位数 |          码点范围          |
| :--: | ---------------------------------------- | :--: | :--------------------: |
|  5   | `111110XX 10XXXXXX 10XXXXXX 10XXXXXX 10XXXXXX` |  26  |  U+200000 ~ U+3FFFFFF  |
|  6   | `1111110X 10XXXXXX 10XXXXXX 10XXXXXX 10XXXXXX 10XXXXXX` |  31  | U+4000000 ~ U+7FFFFFFF |

#### 编码范围与损耗

Unicode的码点范围就是U+0000 ~ U+10FFFF, 四字节的UTF-8编码就已经足够对所有Unicode字符进行编码. 值得注意的是2字节编码11为有效位也能表示所有单字节ASCII字符, 于是Unicode规定对ASCII字符有限采用单字节编码, 因此2字节编码中的重复部分不对应任何编码. 如果在解码过程中遇到一个2字节编码的ASCII字符, 则意味着选择的编码方式不对. 类似的3, 4字节编码中也有一分部分二进制编码不对应任何字符.

#### 简体中文UTF-8编码示例

对于一个具体字符'你'(U+4F60), UTF-8编码的过程如下:

1. 判断码点U+4F60位于U+0800 ~ U+FFFF范围内, 应该采用3字节编码.
1. 码点的二进制形式为`0100 1111 0110 0000`, 三字节编码方式`1110XXXX 10XXXXXX 10XXXXXX`, 替换有效编码X, 得到二进制编码`1110-0100 10-111101 10-10 0000`.
1. 将二进制字节编码形式重新转换成16进制编码得到`E4 BD A0`, 这就是'你'的UTF-8编码.

由于大多数简体中文汉字位于U+0800 ~ U+FFFF范围内均采用3字节编码, 第一字节最高四位固定为`1110`,对应的16进制编是`E`, 因此大多数简体汉字UTF-8编码16进制形式如`EX XX XX`.

### UTF-16

UTF-16是一种变长2或4字节编码方式, 1个代码单元(Code Unit)为2字节, 也就是采用1或2个代码单元进行编码. 对于码点范围U+0000 ~ U+FFFF的基本平面(BMP)内的所有字符, UTF-16采用2个字节即可进行编码. 对与码点范围U+10000 ~ U+10FFFF的增补平面(SP)内的码点, UTF-16采用代理对(Surrogate Pair)进行编码.

#### 代理区

BMP平面内最多可以表示65536个字符, 但是并不是平面上的每个格子都有对应的字符. 在BMP平面中有一片空白区域U+D800 ~ U+DFFF被称为代理区(Surrogate Area), 其中前半部分U+D800 ~ U+DBFF被称为高代理区(High Surrogate Area), 后半部分U+DC00 ~ U+DFFFF被称为低代理区(Low Surrogate Area). 从两个代理区中各取出一个码点即可组成一个代理对(Surrogate Pair).

 ![surrogate_pair](./surrogate_pair.png)

每个代理区包含`4×256`个码点, 那么一个代理对可以表示16个增补平面中所有码点.
$$
(4 * 256 ) * (4 * 256) = 16 * 65536
$$
代理对必须按照高代理对在前, 低代理对在后的方式顺序摆放才能代理一个码点. `D800 CD00`是第一个增补字符, `DBFF DFFF`是最后一个增补字符.

#### 编码过程

BMP平面内的码点直接对应于码点值相同的两个字节, 无需转换.

增补平面SP中的码点要算出对应的高低代理码点的值即可, 公式如下:
$$
Lead = (CodePoint - 10000_{16}) \div 1024 + D800\\
Trail  = (CodePoint - 10000_{16}) \div 1024 + DC00
$$
实际计算码点时不需要真的进行整数除法运算, 只需要进行一些移位操作即可.

### 字节序 BOM

在UTF-16和UTF-32等编码方式中, 一个代码单元包括2或4个字节, 这就产生了一个字节存储顺序([Endianness](https://en.wikipedia.org/wiki/Endianness))的问题. 大端序(Big Endian)存储将高位字节放在前边, 低位字节放在后边, 小端序(Small Endian)则相反.

>  When storing a word in big-endian format the most significant byte, which is the byte containing the [most significant bit](https://en.wikipedia.org/wiki/Most_significant_bit), is stored first and the following bytes are stored in decreasing significance order, the least significant byte, which is the byte containing the [least significant bit](https://en.wikipedia.org/wiki/Least_significant_bit), thus being stored at last place.

BOM正是用来表示UTF-16和UTF-32的字节顺序, BOM就是若干个特殊字节, 放在字节流的最前端, 用来表示字节顺序, 不同编码的字节序如下:

| BOM                             | 编码        | 字节序  |
| ------------------------------- | --------- | ---- |
| 0x2B 0x2F 0x76 0x38 0x2D (5个字节) | UTF-7     | 无    |
| 0xEF 0xBB 0xBF (3个字节)           | UTF-8     | 无    |
| 0xFF 0XFE (2个字节)                | UTF-16-LE | 小端序  |
| 0xFE 0XFF (2个字节)                | UTF-16-BE | 大端序  |
| 0xFF 0XFE 0x00 0x00 (4个字节)      | UTF-32-LE | 小端序  |
| 0x00 0x00 0xFE 0XFF  (4个字节)     | UTF-32-BE | 大端序  |

码点U+FEFF 在UTF-8下的编码正是`EF BB BF`, 叫做零宽度非换行空格(zero-width non-breaking space), 缩写为**ZWNBSP**. 在屏幕上如字面意义一样显示一个宽度为零的空格, 结果就是什么也不显示. BOM利用这一码点标识字节顺序.

Unicode标准中规定UTF-8编码带不带BOM都可以,并且推荐不带BOM以便与ASCII兼容.Windows系统下的UTF-8默认带有BOM, 而eclipse中编辑器使用的UTF-8编码默认不带BOM. UTF-8编码的代码单元(Code Unit)只有一个字节(8bits), 因此并不存在端序的问题.不论BOM出现与否, UTF-8编码的字节流都是一样的.

 > The Unicode Standard allows that the BOM "can serve as signature for UTF-8 encoded text where the character set is unmarked".
 > Windows平台下UTF-8带有BOM仅方便确定其真实编码, 但是这种做法造成了两个文件直接合并后交界处多出一个BOM标志, 对于Linux平台下的工具十分不友好,因此Linux平台下使用的都是不带BOM的UTF-8编码.

UTF-8网络传输使用,内存操作使用UTF-16.

### 错误处理

在字符串(character string)到字节串(byte string)的编码(encoding)过程或者反向的解码(decoding)过程中, 由于使用不同的编码方案可能出现无法编码或者解码的错误情况. 对于这些情况可以选择以下不同的方式进行错误处理.

1. 严格模式, 抛出错误并停止编码解码.
1. 忽略错误.
1. 使用问号?(U+003F或者U+FFFD)替代.
1. 使用相似的字形([glyph](https://en.wikipedia.org/wiki/Glyph))替代.
1. 使用转义(escape)字符替代.

示例如下, 将Unicode字符串"abcdé"使用ASCII进行编码, 字符é(U+00E9)无法编码.

| Error handler             | Output         |
| ------------------------- | -------------- |
| strict                    | raise an error |
| ignore                    | `"abcd"`       |
| replace by ?              | `"abcd?"`      |
| replace by similiar glyph | `"abcde"`      |
| escape as hexadecimal     | `"abcd\xe9"`   |
| escape as XML entities    | `"abcd&#233;"` |

## 汉字编码

### GB2312

> GB 2312-1980，全称《信息交换用汉字编码字符集 基本集》，由国家标准总局于1980年3月9号发布，1981年5月1日实施，通行于大陆。新加坡等地也使用此编码。它是一个简化字的编码规范，也包括其他的符号、字母、日文假名等，共7445个图形字符，其中汉字占6763个。

[国栋](http://my.oschina.net/goldenshaw/blog/352859)对于GB2312的说明:

> 它是一个94×94的表格，理论上有94×94=8836个空间。
> 横的叫区，竖的叫位，总共94个区，区和位的编号都从1开始。

区位码

> 所谓区位码就是这一94×94的大表格中的行号与列号了，均从1开始编号。
> 第一个字符0101为“全角空格”（图中显示为SP（space））。

国标码

> 将区位码的区和位分别加上32（=0x20）就得到了国标码。GB2312方案规定，对上述表中任意一个图形字符都采用两个字节表示，每个字节均采用七位编码表示。一字节有128个空间，128-32=96，实际上，ASCII中第127个也是控制码（DEL， 删除），再减去就还有95个有效位，再加上区位从1开始，又损失了一位，所以最终只有94个有效位了，这也是前面为何是一个94×94的表格。

机内码

> 将国标码高低字节分别加上0x80（=128）就得到了机内码（有时又叫交换码）。128的二进制形式为10000000，加128，简单地讲，就是把国标码最高位置成1. 就是要兼容ASCII，ASCII最高位为0，国标码加128后，高低字节的最高位都成了1，这样就与ASCII区分开来。

### GBK

> GBK是对GB2312的一个扩展，兼容GB2312，因此也兼容ASCII，也是一个变长编码方案。GBK总体编码范围为8140-FEFE，首字节在81-FE 之间，尾字节在40-FE 之间，总计23940 个码位，共收入21886个汉字和图形符号，其中汉字（包括部首和构件）21003 个，图形符号883 个。GBK是国家有关部门与一些信息行业企业等一起合作推出的方案，但并未作为国家标准发布，只是一个事实上的标准，一个过渡方案，为GB18030标准作的一个准备。

## 缺省编码

Windows与Linux平台下使用的默认编码并不相同, 因此同一文件在不同系统间会造成显示乱码的现象. Windows系统下使用默认编码ANSI(America Nantional Standards Institue), ANSI并不指某个固定编码, 在Win7简体中文系统下ANSI就是GBK编码, 在港台地区可能是Big5(繁体中文的一种编码方案), 在欧洲可能是(Latin-1). 即使都是简体中文系统, XP和Win7的默认编码也肯能不一致.
Linux系统下的默认编码都是不带BOM的UTF-8编码.
Windows平台下的记事本编码比较坑爹, 如下图中显示有四种编码. 
 ![notepad_encoding](./notepad_encoding.png)
但是指代的具体编码却并不明显, 如下表, ANSI默认为GBK编码, Unicode实际上指的是, 与Unicode big endian(UTF-16-BE)对应, 注意UTF-16都是带有BOM的, UTF-8

| 名称                 | 具体编码          |
| ------------------ | ------------- |
| ANSI(默认编码)         | 简体中文Win7下为GBK |
| Unicode            | 小端序UTF-16     |
| Unicode big endian | 大端序UTF-16     |
| UTF-8              | 带BOM的UTF-8    |

记事本编码名称的随意造成了很多误解.

Windows记事本乱码比较出名的一个例子跟"联通"有关. 使用默认编码新建一个文本文档, 其内容只有"联通"两个字, 之后重新打开记事本, 文本内容却变成了乱码"��ͨ". 原因是"联通"在默认编码GBK下为

> C1 AA CD

其二进制形式为

> 1100001 10101010 11001101 10101000

正好符合UTF-8编码的二字节编码

> 110XXXXX 10XXXXXX

因此被解码为

 ![liantong](./liantong.png)

得到的码点为U+006A, 这个码点在U+0000 ~ U+007F之间, UTF-8对这个范围内的码点使用单字节编码. 因此二字节编码与U+0000 ~ U+007F范围对应的部分废弃掉了, 不对应任何字符. 因此这两个字节无法成功解码, 使用Unicode字符'�'代替.

虽然显示出现了乱码, 但是文件的内容并没有改变, 因此只需要使用Vim明确指定文件编码为GBK即可正确显示,下面设置首先使用GBK对文件解码.

```viml
set fileencodings=ucs-bom,gbk,utf-8,gb18030,big5,euc-jp,euc-kr,latin1
```

另外还有一点值得注意, Win7简体中文系统对**文件内容**默认采用GBK编码, 但是**文件名称**却是使用UTF-16编码, 因此可以使用上述Unicode字符'�'作为文件名称.

## 指定编码

有一些文件会在第一行或者前几行中指定文件编码, 如xml/html/python/ruby等源文件.

```xml
<?xml version="1.0" encoding="UTF-8"?>
```

```html
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
```

```python
# -*- coding: utf-8 -*-
```

由于前几行都是ASCII字符, 这种策略首先使用ASCII对于文件进行解码, 获得指定的正确编码后在对文件重新解码.

## JavaScript

## C++

C++11之前, `wchar_t`类型对宽字符提供同支持, 但是标准并没有规定其实现, 因此`wchar_t`的具体类型与实现相关. 在windows平台下`whcar_t`是2个字节, 在Linux平台下是4个字节, 这种不一致性使得使用`wchar_t`的代码不具有移植性. 宽字符与字符串字面量(Wide-Character String Literal)使用L开头作为标志, 如下所示.

```C++
wchar_t wc = L'中';
wchar_t wc_array[] = L"汉字";
std::wstring wstr = L"汉字";
```

**U**nicode **S**tring **L**iteral是C++11对Unicode提供的语言级别的支持. C++11新增字符类型`char16_t`(至少16位)和`char32_t`(至少32位)分别表示UTF-16和UTF-32编码的代码单元, Unicode三种编码UTF-8, UTF-16, UTF-32对应的字符串字面量分别以u8, u, U前缀作为标志.

```C++
char u8char = 'a';
char u8char_array[] = u8"\U0001F607 is O:-)";
std::string u8str   = u8"\U0001F607 is O:-)";

char16_t u16char = u'😃';
char16_t u16char_array[] = u"😃 = \U0001F603 is :-D";
std::u16string u16str    = u"😃 = \U0001F603 is :-D";

char32_t u32char = U"😎";
char32_t u32char_array[] = U"😎 = \U0001F60E is B-)";
std::u32string u32str    = U"😎 = \U0001F60E is B-)";
```

## Java

Java规定源代码默认用UTF-16编码, 其中String类的length方法说明如下:

> Returns the length of this string. The length is equal to the number of [Unicode code units](http://download.oracle.com/javase/7/docs/api/java/lang/Character.html#unicode) in the string.
>
> 返回字符串的长度,这一长度等于字符串中Unicode代码单元的数目.

由于BMP范围内的编码只需要一个代码单元就可以表示,因此由BMP范围内的字符组成的字符串,length返回的长度和字符的个数一致. 超过BMP范围的字符, 每个需要两个代码单元进行编码,length返回的长度与字符个数并不一致.

另外Java中String类的getBytes()方法说明如下:

> Encodes this `String` into a sequence of bytes using the given [charset](https://docs.oracle.com/javase/7/docs/api/java/nio/charset/Charset.html), storing the result into a new byte array.
>
> 使用指定编码方式将字符串进行编码,并将结果存入一个新的字节数组.

不指定字符集时将使用默认的编码, JVM默认的编码方式是UTF-8, 这一点可以使用命令行参数控制.

```bash
javaw.exe -Dfile.encoding=UTF-8
```

需要注意的是如果如果使用UTF-16编码, 得到的字节流中会包含BOM, 结果字节流的长度比预期的要多2个字节.

## 参考资料

相关书籍与网络资源:

1. [字符集与编码系列博客 - 国栋](http://my.oschina.net/goldenshaw/blog/304493?fromerr=ChUuZ0yx)
1. [The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets (No Excuses!)](http://www.joelonsoftware.com/articles/Unicode.html)
1. [Unicode book](http://unicodebook.readthedocs.io/index.html)
1. [UTF-8 and Unicode FAQ for Unix/Linux](UTF-8 and Unicode FAQ for Unix/Linux)
1. [破晓的博客C+11与Unicode](http://blog.poxiao.me/p/unicode-character-encoding-conversion-in-cpp11/)
1. [Unicode Explained](http://shop.oreilly.com/product/9780596101213.do)
1. [The Unicode Standard](http://shop.oreilly.com/product/9780596101213.do)
1. International Components for Unicode (ICU)
1. [Boost.Locale](http://www.boost.org/doc/libs/1_60_0/libs/locale/doc/html/index.html)
1. [Boost.Nowide](http://cppcms.com/files/nowide/html/)
1. [iconv](http://www.gnu.org/software/libiconv/)
1. [UTF8 everywhere](http://utf8everywhere.org/)
1. [Should UTF-16 be considered harmful?](http://programmers.stackexchange.com/questions/102205/should-utf-16-be-considered-harmful)
1. [Unicode in C++](https://channel9.msdn.com/Events/CPP/C-PP-Con-2014/Unicode-in-CPP)