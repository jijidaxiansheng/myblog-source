---
title: "C 语言顺序表入门：从存储结构到常用操作实现"
date: 2025-05-20 20:12:42
cover: /img/top.jpg
description: "用一篇文章梳理顺序表的定义、特点，以及在 C 语言里如何完成初始化、插入、删除、扩容与遍历。"
tags:
  - C语言
  - 数据结构
categories:
  - 编程基础
---

顺序表是数据结构学习里非常适合入门的一种线性结构。它的逻辑关系很直观，底层实现也不复杂，但正因为简单，特别适合拿来练习数组、指针、边界处理和函数封装。

<!-- more -->

这篇文章不追求把概念讲得很“玄”，而是围绕一个目标展开：用 C 语言写出一个能正常使用的顺序表，并理解它为什么这样设计。

## 什么是顺序表

顺序表可以理解为“用一段连续存储空间保存多个同类型元素”的线性表。

如果我们把一组整数依次放进数组里：

```c
10 20 30 40 50
```

那么这组数据在内存中通常是连续存放的，访问第 `i` 个元素时，可以直接通过下标定位。这种“逻辑上相邻，物理上也相邻”的结构，就是顺序表最核心的特点。

顺序表常见的两个实现方向是：

1. 静态顺序表：底层数组长度固定，简单但容量受限。
2. 动态顺序表：底层空间不够时自动扩容，更接近实际开发中的使用方式。

如果是练习数据结构，我更建议直接从动态顺序表开始，因为它能把数组、内存管理和接口设计一起串起来。

## 顺序表的特点

顺序表的优点很明显：

- 支持随机访问，按下标读取元素很快。
- 结构简单，底层容易实现。
- 缓存友好，遍历效率通常不错。

它的局限也同样明显：

- 中间位置插入或删除元素时，需要移动后续数据。
- 如果容量不够，扩容会带来额外开销。
- 必须保证连续存储空间，内存管理要更仔细。

所以顺序表很适合“读多改少”或者“尾部追加较多”的场景，但如果频繁在中间插入删除，就不一定是最合适的选择。

## 先设计一个顺序表结构

为了让顺序表既能存数据，又能知道当前用了多少空间、总容量是多少，我们可以先定义一个结构体：

```c
typedef int DataType;

typedef struct SeqList {
    DataType *data;
    int size;
    int capacity;
} SeqList;
```

这里有 3 个关键成员：

- `data`：指向动态数组的首地址。
- `size`：当前已经存了多少个元素。
- `capacity`：当前总共能存多少个元素。

这个设计非常常见，因为它把“有效数据个数”和“底层空间大小”区分开了。很多初学者一开始容易把两者混在一起，后面一做插入删除就容易出错。

## 常用操作应该有哪些

一个基本可用的顺序表，通常至少要支持这些能力：

- 初始化
- 销毁
- 打印
- 尾插
- 任意位置插入
- 任意位置删除
- 按下标访问
- 容量不足时扩容

如果这些接口都能稳定运行，这个顺序表就已经具备练习和使用价值了。

## 关键思路：容量不够时先扩容

动态顺序表和普通数组最大的区别，就在于“空间不够时怎么办”。

最直接的做法是：

1. 申请一块更大的新空间。
2. 把旧数据复制过去。
3. 释放旧空间。
4. 更新指针和容量。

在 C 语言里，这个过程通常可以交给 `realloc` 来做。为了让主逻辑更清晰，我们可以把扩容单独封装成一个函数。

## 一份完整可运行的实现

下面给出一个适合学习阶段使用的动态顺序表示例：

```c
#include <stdio.h>
#include <stdlib.h>

typedef int DataType;

typedef struct SeqList {
    DataType *data;
    int size;
    int capacity;
} SeqList;

void InitList(SeqList *list) {
    list->data = NULL;
    list->size = 0;
    list->capacity = 0;
}

void DestroyList(SeqList *list) {
    free(list->data);
    list->data = NULL;
    list->size = 0;
    list->capacity = 0;
}

int EnsureCapacity(SeqList *list) {
    if (list->size < list->capacity) {
        return 1;
    }

    int newCapacity = (list->capacity == 0) ? 4 : list->capacity * 2;
    DataType *tmp = (DataType *)realloc(list->data, newCapacity * sizeof(DataType));
    if (tmp == NULL) {
        return 0;
    }

    list->data = tmp;
    list->capacity = newCapacity;
    return 1;
}

int PushBack(SeqList *list, DataType value) {
    if (!EnsureCapacity(list)) {
        return 0;
    }

    list->data[list->size] = value;
    list->size++;
    return 1;
}

int Insert(SeqList *list, int pos, DataType value) {
    if (pos < 0 || pos > list->size) {
        return 0;
    }

    if (!EnsureCapacity(list)) {
        return 0;
    }

    for (int i = list->size; i > pos; --i) {
        list->data[i] = list->data[i - 1];
    }

    list->data[pos] = value;
    list->size++;
    return 1;
}

int Erase(SeqList *list, int pos) {
    if (pos < 0 || pos >= list->size) {
        return 0;
    }

    for (int i = pos; i < list->size - 1; ++i) {
        list->data[i] = list->data[i + 1];
    }

    list->size--;
    return 1;
}

void PrintList(const SeqList *list) {
    for (int i = 0; i < list->size; ++i) {
        printf("%d ", list->data[i]);
    }
    printf("\n");
}

int main(void) {
    SeqList list;
    InitList(&list);

    PushBack(&list, 10);
    PushBack(&list, 20);
    PushBack(&list, 30);
    Insert(&list, 1, 15);
    Erase(&list, 2);

    PrintList(&list);
    DestroyList(&list);
    return 0;
}
```

运行后，输出结果为：

```text
10 15 30
```

这个结果可以帮助我们验证逻辑：

- 原始尾插后得到 `10 20 30`
- 在下标 `1` 的位置插入 `15`，得到 `10 15 20 30`
- 删除下标 `2` 的元素后，变成 `10 15 30`

## 插入操作为什么要从后往前移动

插入是顺序表里最容易写错的部分之一。

假设当前数据是：

```text
10 20 30 40
```

如果要在下标 `1` 插入一个新元素 `15`，那么原本的 `20 30 40` 都要整体后移一位。

这里必须从后往前搬移：

```c
for (int i = list->size; i > pos; --i) {
    list->data[i] = list->data[i - 1];
}
```

如果从前往后移动，前面的元素会把后面的原始值覆盖掉，最终数据就乱了。

## 删除操作的本质

删除和插入正好相反。

当删除某个位置的元素后，需要把它后面的元素整体向前移动一位，这样才能保证逻辑上的连续性：

```c
for (int i = pos; i < list->size - 1; ++i) {
    list->data[i] = list->data[i + 1];
}
```

最后再把 `size` 减 1，就表示有效元素个数少了一个。

注意，这里通常不需要真的把最后一个位置清零，因为只要 `size` 变了，逻辑上那个位置就已经不属于当前顺序表的有效数据范围。

## 学顺序表时最容易踩的坑

如果你刚开始写这个结构，下面几个问题很常见：

### 1. 忘记检查下标是否合法

插入和删除时一定要做边界判断。

- 插入允许 `pos == size`，因为这相当于尾插。
- 删除要求 `0 <= pos < size`，否则就会越界。

### 2. 扩容成功前就直接改原指针

`realloc` 失败时会返回 `NULL`，如果你直接写：

```c
list->data = realloc(list->data, newCapacity * sizeof(DataType));
```

一旦失败，原来的地址就丢了，后面既无法继续使用，也无法正确释放。

更稳妥的写法是先接到临时指针里，再判断是否成功。

### 3. 把容量和元素个数混为一谈

`capacity` 表示总空间，`size` 表示有效数据个数。

很多 bug 本质上都来自这两个变量意义不清晰，比如访问了还没赋值的位置，或者插入时忘记先扩容。

## 顺序表的时间复杂度

掌握复杂度，有助于理解它的适用场景：

- 按下标访问：`O(1)`
- 尾部追加：平均情况下 `O(1)`，扩容时会退化
- 中间插入：`O(n)`
- 中间删除：`O(n)`
- 遍历：`O(n)`

这也是为什么顺序表虽然常用，但并不是所有线性问题的最优解。

## 可以继续往下扩展什么

如果你已经能写出基础版本，可以继续补这些能力：

- 查找指定元素
- 修改指定位置的值
- 头插与头删
- 判空
- 获取当前长度
- 清空顺序表

再往后，还可以尝试把 `int` 改成更通用的类型设计，或者和链表做一组对比练习，效果会非常好。

## 总结

顺序表本质上就是“用连续空间管理一组线性数据”。它的重点不在于概念有多难，而在于你是否真正理解了这几件事：

- 数据为什么要连续存放
- 插入和删除为什么需要移动元素
- `size` 和 `capacity` 分别表示什么
- 扩容时为什么要格外小心指针

把这些地方写顺了，后面再学链表、栈、队列，思路会轻松很多。

如果你正在复习 C 语言数据结构，我很推荐你自己再手敲一遍这份代码，尤其是插入、删除和扩容这三个部分。真正写通一次，比只看概念有效得多。
