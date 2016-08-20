<!-- animate:zoom theme:light -->
# Vortex
 一款使用 Markdown 进行幻灯片制作与演示的开源软件， **“通过易读易写的纯文本格式编写简洁的幻灯片”**

---
## 主要特性

* Markdown 语法
* 丰富的动画与主题
* 导出 pdf 文件
* 代码高亮、数学公式、流程图、序列图、甘特图
* 通过CSS定制整个编辑器的界面
* 全平台支持，包括 Linux、OSX、Windows

---
<!-- animate:rotateDownLeft theme:light -->
## Markdown 语法


> Markdown 语法可以参考：http://wowubuntu.com/markdown/

---
<!-- animate:rotateUpLeft theme:light -->
## 切分幻灯片
通过三条中划线进行切分
```
第一帧

---

第二帧
```
> 需要注意的是中划线上面必须空出一行

---
## 动画与主题
<!-- animate:rotateDownRight theme:light -->

* 内置了丰富的动画效果和主题，参考 https://github.com/tajpure/vortex#metadata

* 通过在帧内声明如下注释来定义动画与主题
```
<!-- animate:rotateDownLeft theme:dark -->
```

---
<!-- animate:rotateUpRight theme:light -->
## 部分编辑器快捷键
* Alt，显示默认隐藏菜单 `其它快捷键可以在菜单里找到`
* Ctrl + F 文本搜索
* Ctrl + Shift + R 文本替换
* Esc 退出预览全屏模式
* ArrowLeft，ArrowUp  上一帧
* Space，ArrowRight，ArrowDown  下一帧
* F11 进入或退出全屏

---
<!-- animate:zoom theme:light -->
## 代码高亮
``` python
def fib(n):
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a+b
    print()
```

---
## 数学公式
使用KaTex渲染，例如：

* 行内公式 $c = \\pm\\sqrt{a^2 + b^2}$

* 块级公式 $$c = \\pm\\sqrt{a^2 + b^2}$$

---
## 流程图
```
graph TD
 A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
```


---
<!-- animate:rotateUpLeft theme:light -->
## 序列图
```
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
```

---
<!-- animate:rotateUpLeft theme:light -->
## 甘特图
```
gantt
    title A Gantt Diagram
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    anther task      : 24d
```

---
## 以上图表具体语法参考 http://knsv.github.io/mermaid

---
## 图标
<i class="material-icons">sentiment_very_satisfied</i>
<i class="material-icons">sentiment_dissatisfied</i>
<i class="material-icons">cake</i>
<i class="material-icons">notifications_none</i>

> 参考 https://design.google.com/icons

---
## 自定义CSS
Vortex在启动时会加载位于用户目录下的**./vortex/user.css**文件，通过在这个文件里声明样式可以自定义动画、主题、编辑器字体和字体大小。甚至可以重写整个Vortex的界面。

---
## 全平台支持
由于该应用使用 Electron 编写，因此可以支持各个平台。具体的应用包可以在这里下载：https://github.com/tajpure/vortex/releases

---
## 反馈
https://github.com/tajpure/vortex/issues
