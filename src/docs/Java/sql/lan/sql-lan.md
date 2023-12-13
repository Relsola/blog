# SQL 语法基础

## 基础

1. 模式定义了数据如何存储、存储什么样的数据以及数据如何分解等信息，数据库和表都有模式。

2. 主键的值不允许修改，也不允许复用(不能使用已经删除的主键值赋给新数据行的主键)。

3. SQL(Structured Query Language)，标准 SQL 由 ANSI 标准委员会管理，从而称为 ANSI SQL。各个 DBMS 都有自己的实现，如 PL/SQL、Transact-SQL 等。

4. SQL 语句不区分大小写，但是数据库表名、列名和值是否区分依赖于具体的 DBMS 以及配置。

```sql
# 注释
SELECT *
FROM coo; -- 注释
/* 注释1
   注释2 */
```

数据库创建与使用:

```sql
# 注释
CREATE DATABASE test;
USE test;
```

## 创建表

```sql
CREATE TABLE coo (
  id INT NOT NULL AUTO_INCREMENT,
  col1 INT NOT NULL DEFAULT 1,
  col2 VARCHAR(45) NULL,
  col3 DATE NULL,
  PRIMARY KEY (`id`));
```

## 修改表

## 插入

## 更新

## 删除

## 查询

### DISTINCT

### LIMIT

## 排序

## 过滤

## 通配符

## 计算字段

## 函数

### 汇总

### 文本处理

### 日期和时间处理

### 数值处理

## 分组

## 子查询

## 连接

### 内连接

### 自连接

### 自然连接

### 外连接

## 组合查询

## 视图

## 存储过程

## 游标

## 触发器

## 事务管理

## 字符集

## 权限管理
