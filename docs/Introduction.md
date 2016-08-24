<!-- animate:fadeUp theme:light -->
# Vortex
A powerful markdown presentation tool.

---
## Features
* Markdown Syntax
* Beautiful Animates & Themes
* PDF Export
* Syntax Highdark
* Flowchart & Sequence Diagram & Gant Diagram
* Customize By CSS
* Support Linux, OSX, Windows

---
## Syntax
Using [Markdown](https://daringfireball.net/projects/markdown/) write slides

Split Slides
```
Slide 0

---

Slide 1
```
> A blank line before `---` is needed.

---
## Animates & Themes

* You can find all the animates and themes from [here](https://github.com/tajpure/vortex)

* After declare this statement in the slides, the effect will be applied.

```
<!-- animate:rotateDownRight theme:dark -->
```

---
## Some useful shortcuts
* Alt : Show the menu (For Windows)
* CmdOrCtrl + F : Search
* (Ctrl + Shift + R) or (Cmd + Opt + F) : Replace
* Alt + G : Jump to line
* Esc : Exit preview full screen
* ArrowLeft，ArrowUp : Previous slide
* Space，ArrowRight，ArrowDown : Next slide

> Other shortcuts you can find in the menu.

---
## Syntax Highlight
``` python
def fib(n):
    a, b = 0, 1
    while a < n:
        print(a, end=' ')
        a, b = b, a+b
    print()
```

---
## Math Equations
Support TeX math，eg:

* Inline $c = \\pm\\sqrt{a^2 + b^2}$

* Block $$c = \\pm\\sqrt{a^2 + b^2}$$

---
## Flowchart
```
graph TD
 A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
```


---
## Sequence Diagram
```
sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
```

---
## Gant Diagram
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
## The diagram syntax you can find in http://knsv.github.io/mermaid

---
## Icons
<i class="material-icons">sentiment_very_satisfied</i>
<i class="material-icons">sentiment_dissatisfied</i>
<i class="material-icons">cake</i>
<i class="material-icons">notifications_none</i>

> https://design.google.com/icons

---
## Customize CSS
Vortex will auto load **/yourhomedir/.vortex/user.css** before start.
You can define animates, themes and the style of the editor by CSS.

---
## Feedback
https://github.com/tajpure/vortex/issues
