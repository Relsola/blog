---
sidebar: auto
---

# Git常用命令

## 配置全局信息

#### 配置用户名和邮箱
``` sh
$ git config --global user.name "xxx"
$ git config --global user.email "xxx@xxx"
```

#### 获取当前用户名和邮箱
``` sh
$ git config user.name
$ git config user.email
```

## 初始化仓库
``` sh
$ git init
```

## 远程仓库

#### 关联一个远程仓库
```sh
$ git remote add origin git@github.com:xxxxx/xxx
```

#### 查看远程仓库主机名
```sh
$ git remote
```

#### 从远程获取代码并合并本地的版本
```sh
$ git pull origin 远程分支名:本地分支名
```

#### 推送分支
```sh
# 将本地分支的更新，推送到远程主机
git push origin 本地分支名:远程分支名
```

#### 关联一个默认主机
::: tip
如果当前分支与多个主机存在追踪关系，则可以使用 `-u` 选项指定一个默认主机，这样后面就可以不加任何参数使用 `git push` 。
:::
``` sh
$ git push -u origin master
```

#### 克隆远程仓库
```sh
$ git clone git@github.com:xxx/xxx
```

## 添加文件
```sh
# 将xxx文件添加至暂存区
$ git add xxx.js

# 将有更新的所有文件添加至暂存区
$ git add .
```

## 提交文件
-m '说明注释' 代表本次提交的说明注释信息，其规范如下：

| 类型  |  详细介绍  |
| :---: | :--------: |
| feat  | 新功能、新特性 |
| fix  | bugfix，修改问题 |
| refactor | 代码重构 |
| docs  | 文档修改 |
| style  | 代码格式修改 |
| test  | 测试用例修改|
| chore  | 其他修改，比如构建，依赖管理 |

```sh
$ git commit -m '说明注释'

# 相当于git add . + git commit -m  指令,但对于新增的文件不能直接使用该指令进行提交
$ git commit -am "说明注释"
```

#### 修改最近的一次提交信息

```sh
$ git commit --amend
```
具体操作：
1. **git commit --amend** 在弹出面板中输入 **i** 进入编辑模式，然后可以修改 **commit message** 信息
2. 修改完成之后，按 **Esc** 退出编辑，输入 **:wq** 退出，完成修改
3. 如果想在最近的一次修改中，新增其他修改，可以使用 **git commit --amend -a** 指令，类似上面两步操作，可以在第二步结束后自动带上暂存区的操作。


## 管理仓库

### 获取当前仓库的状态
```sh
$ git status
```

### 查看修改的内容
``` sh
$ git diff
```

### 查看提交记录
::: tip
`HEAD`：代表当前版本  
`HEAD^`：代表上一个版本  
`HEAD^^`：代表上上一个版本
:::
```sh
$ git log
```

### 撤销内容
```sh
# 丢弃对应文件工作区的内容
$ git restore xxx

# 将提交至暂存区的文件重新放回工作区
git restore --stage xxx
```

### 版本回退

修改HEAD指针指向的位置，便于我们回退版本。完成回退操作之后，则HEAD指针新指向的版本之后的所有版本都被丢弃。
```sh
$ git reset [--soft | --mixed | --hard] [HEAD]
```
* --hard 回退到上一个版本，并将工作区的所有内容进行删除，是一个全方面的回退
* --soft 回退到上一个版本，而上一个版本到当前，这期间的修改内容会被重新放入暂存区
* --mixed 默认，可以不用带该参数，回退到上一个版本，从上一个版本到当前，这期间的修改内容都会被重新放入工作区，也就是工作区文件内容保持不变


## 分支管理

分支规范：
| 分支  |  介绍  |
| :---: | :--------: |
|  master  | 产品分支：只能从其他分支合并内容，不能在这个分支直接修改。合并到master上的commit只能来字release分支或hotfix分支 |
|  develop  | 开发主干分支：基于master的tag建立，主要用来暂时保存开发完成而又未发布的feature分支内容，以及release和hotfix的补充内容 |
|  feature  | 功能分支：一般一个新功能对应一个功能分支，从而和已经完成的功能隔离开来，而且只有在新功能完成开发的情况下，其对应的feature分支才会合并到主开发分支（develop分支）上 |
|  release  | 预发分支：当需要发布时，我们从develop分支创建一个release分支，然后这个release分支会发布到测试环境进行测试，如果发现问题就在这个分支直接进行修复。发布结束后，这个release分支会合并到develop和master分支，从而保证不会有代码丢失。|
|  hotfix  | 补丁分支：主要用于紧急修复一些bug，会从master分支上的某一个tag建立，修复结束后再合并到develop和master分支上  |


### 创建分支
```sh
$ git branch xxx
```

### 切换分支
```sh
$ git checkout xxx

# 以当前分支为基础，创建一个新的分支并切换至该分区
$ git checkout -b xxx
```

### 查看分支
```sh
# 查看本地分支
$ git branch

# 查看所有分支
$ git branch -a

# 查看远程分支
$ git branch -r
```

### 合并分支
```sh
# 将 branchName 分支合并到当前分支中，自动进行新的提交
$ git merge branchName

# 当合并遇到冲突时 退出合并
$ git merge --abort

# 当合并遇到冲突，解决完冲突之后，可执行该指令完成合并
git merge --continue
```

### 删除分支
```sh
# 删除本地分支（删除不了未合并过的分支）
$ git branch -d xxx

# 删除未合并过的本地分支
$ git branch -D xxx
```

### Bug分支
需要临时处理bug，但是手头工作又没能完全处理完时：

```sh
# 将当前的更改存储在一个额外的工作目录中
$ git stash

# 创建并切换到bug分支

$ git checkout -b xxx

# 修复提交bug分支
$ git add xxx git commit -m xx`

# 切换到主分支
$ git checkout master

# 合并bug分支到主分支
$ git merge xxx

# 删除bug分支
$ git branch -d xxx

# 恢复隐藏的工作现成
$ git stash pop
```