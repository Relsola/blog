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

添加列

```sql
ALTER TABLE coo
ADD col CHAR(20);
```

修改列和属性

```sql
---ALTER TABLE 表名 CHANGE 原字段名 新字段名 字段类型 约束条件
ALTER TABLE coo
CHANGE col col1 CHAR(32) NOT NULL DEFAULT '123';
```

删除列

```sql
ALTER TABLE coo
DROP COLUMN col;
```

删除表

```sql
DROP TABLE coo;
```

## 插入

普通插入

```sql
INSERT INTO coo(col1, col2)
VALUES(val1, val2);
```

插入检索出来的数据

```sql
INSERT INTO coo1(col1, col2)
SELECT col1, col2
FROM coo2;
```

将一个表的内容插入到一个新表

```sql
CREATE TABLE newTable AS
SELECT * FROM coo;
```

## 更新

```sql
UPDATE coo
SET col = val
WHERE id = 1;
```

## 删除

```sql
DELETE FROM coo
WHERE id = 1;
```

`TRUNCATE TABLE` 可以清空表，也就是删除所有行。

```sql
TRUNCATE TABLE coo;
```

使用更新和删除操作时一定要用 `WHERE` 子句，不然会把整张表的数据都破坏。  
可以先用 `SELECT` 语句进行测试，防止错误删除。

## 查询

### DISTINCT

相同值只会出现一次。它作用于所有列，也就是说所有列的值都相同才算相同。

```sql
SELECT DISTINCT col1, col2
FROM coo;
```

### LIMIT

- 限制返回的行数
- 可以有两个参数，第一个参数为起始行，从 0 开始
- 第二个参数为返回的总行数

返回前 5 行:

```sql
SELECT *
FROM coo
LIMIT 5;
```

```sql
SELECT *
FROM coo
LIMIT 0, 5;
```

返回第 3 ~ 5 行:

```sql
SELECT *
FROM coo
LIMIT 2, 3;
```

## 排序

- `ASC` : 升序(默认)
- `DESC` : 降序

可以按多个列进行排序，并且为每个列指定不同的排序方式:

```sql
SELECT *
FROM coo
ORDER BY col1 DESC, col2 ASC;
```

## 过滤

不进行过滤的数据非常大，导致通过网络传输了多余的数据，从而浪费了网络带宽。  
因此尽量使用 `SQL` 语句来过滤不必要的数据，而不是传输所有的数据到客户端中然后由客户端进行过滤。

```sql
SELECT *
FROM coo
WHERE col IS NULL;
```

下表显示了 `WHERE` 子句可用的操作符

|  操作符   |     说明     |
| :-------: | :----------: |
|    `=`    |     等于     |
|    `<`    |     小于     |
|    `>`    |     大于     |
|  `<> !=`  |    不等于    |
|  `<= !>`  |   小于等于   |
|  `>= !<`  |   大于等于   |
| `BETWEEN` | 在两个值之间 |
| `IS NULL` |  为 NULL 值  |

::: warning 注意

- `NULL` 与 `0`、空字符串都不同。
- `AND` 和 `OR` 用于连接多个过滤条件。
- 优先处理 `AND` ，当一个过滤表达式涉及到多个 `AND` 和 `OR` 时，可以使用 `()` 来决定优先级，使得优先级关系更清晰。
- `IN` 操作符用于匹配一组值，其后也可以接一个 `SELECT` 子句，从而匹配子查询得到的一组值。
- `NOT` 操作符用于否定一个条件。

:::

## 通配符

通配符也是用在过滤语句中，但它只能用于文本字段。

- `%` 匹配 `>=0` 个任意字符；
- `_` 匹配 `==1` 个任意字符；
- `[ ]` 可以匹配集合内的字符，例如 `[ab]` 将匹配字符 `a` 或者 `b`；
- 用脱字符 `^` 可以对集合进行否定，也就是不匹配集合内的字符。

使用 Like 来进行通配符匹配。

```sql
SELECT *
FROM coo
WHERE col LIKE '[^AB]%'; -- 不以 A 和 B 开头的任意文本
```

不要滥用通配符，通配符位于开头处匹配会非常慢。

## 计算字段

在数据库服务器上完成数据的转换和格式化的工作往往比客户端上快得多，  
并且转换和格式化后的数据量更少的话可以减少网络通信量。

计算字段通常需要使用 `AS` 来取别名，否则输出的时候字段名为计算表达式。

```sql
SELECT col1 * col2 AS alias
FROM coo;
```

`CONCAT()` 用于连接两个字段。  
许多数据库会使用空格把一个值填充为列宽，因此连接的结果会出现一些不必要的空格，  
使用 `TRIM()` 可以去除首尾空格。

```sql
SELECT CONCAT(TRIM(col1), '(', TRIM(col2), ')') AS concat_col
FROM coo;
```

## 函数

各个 `DBMS` 的函数都是不相同的，因此不可移植，以下主要是 `MySQL` 的函数。

### 汇总

|   函 数   |      说 明       |
| :-------: | :--------------: |
|  `AVG()`  | 返回某列的平均值 |
| `COUNT()` |  返回某列的行数  |
|  `MAX()`  | 返回某列的最大值 |
|  `MIN()`  | 返回某列的最小值 |
|  `SUM()`  |  返回某列值之和  |

`AVG()` 会忽略 `NULL` 行。

使用 `DISTINCT` 可以让汇总函数值汇总不同的值。

```sql
SELECT AVG(DISTINCT col1) AS avg_col
FROM coo;
```

### 文本处理

|    函 数    |     说 明      |
| :---------: | :------------: |
|  `LEFT()`   |   左边的字符   |
|  `RIGHT()`  |   右边的字符   |
|  `LOWER()`  | 转换为小写字符 |
|  `UPPER()`  | 转换为大写字符 |
|  `LTRIM()`  | 去除左边的空格 |
|  `RTRIM()`  | 去除右边的空格 |
| `LENGTH()`  |      长度      |
| `SOUNDEX()` |  转换为语音值  |

其中， `SOUNDEX()` 可以将一个字符串转换为描述其语音表示的字母数字模式。

```sql
SELECT *
FROM coo
WHERE SOUNDEX(col1) = SOUNDEX('apple')
```

### 日期和时间处理

- 日期格式: YYYY-MM-DD
- 时间格式: HH:MM:SS

|      函 数      |             说 明              |
| :-------------: | :----------------------------: |
|   `AddDate()`   |     增加一个日期(天、周等)     |
|   `AddTime()`   |     增加一个时间(时、分等)     |
|   `CurDate()`   |          返回当前日期          |
|   `CurTime()`   |          返回当前时间          |
|    `Date()`     |     返回日期时间的日期部分     |
|  `DateDiff()`   |        计算两个日期之差        |
|  `Date_Add()`   |     高度灵活的日期运算函数     |
| `Date_Format()` |  返回一个格式化的日期或时间串  |
|     `Day()`     |     返回一个日期的天数部分     |
|  `DayOfWeek()`  | 对于一个日期，返回对应的星期几 |
|    `Hour()`     |     返回一个时间的小时部分     |
|   `Minute()`    |     返回一个时间的分钟部分     |
|    `Month()`    |     返回一个日期的月份部分     |
|     `Now()`     |       返回当前日期和时间       |
|   `Second()`    |      返回一个时间的秒部分      |
|    `Time()`     |   返回一个日期时间的时间部分   |
|    `Year()`     |     返回一个日期的年份部分     |

```sql
mysql> SELECT NOW();
```

```text
2018-4-14 20:25:11
```

### 数值处理

|  函 数   | 说 明  |
| :------: | :----: |
| `SIN()`  |  正弦  |
| `COS()`  |  余弦  |
| `TAN()`  |  正切  |
| `ABS()`  | 绝对值 |
| `SQRT()` | 平方根 |
| `MOD()`  |  余数  |
| `EXP()`  |  指数  |
|  `PI()`  | 圆周率 |
| `RAND()` | 随机数 |

## 分组

分组就是把具有相同的数据值的行放在同一组中。

可以对同一分组数据使用汇总函数进行处理，例如求分组数据的平均值等。

指定的分组字段除了能按该字段进行分组，也会自动按该字段进行排序。

```sql
SELECT col, COUNT(*) AS num
FROM coo
GROUP BY col;
```

`GROUP BY` 自动按分组字段进行排序，`ORDER BY` 也可以按汇总字段来进行排序。

```sql
SELECT col, COUNT(*) AS num
FROM coo
GROUP BY col
ORDER BY num;
```

`WHERE` 过滤行， `HAVING` 过滤分组，行过滤应当先于分组过滤。

```sql
SELECT col, COUNT(*) AS num
FROM coo
WHERE col > 2
GROUP BY col
HAVING num >= 2;
```

分组规定:

- `GROUP BY` 子句出现在 `WHERE` 子句之后，`ORDER BY` 子句之前；
- 除了汇总字段外，`SELECT` 语句中的每一字段都必须在 `GROUP BY` 子句中给出；
- `NULL` 的行会单独分为一组；
- 大多数 `SQL` 实现不支持 `GROUP BY` 列具有可变长度的数据类型。

## 子查询

子查询中只能返回一个字段的数据。

可以将子查询的结果作为 `WHERE` 语句的过滤条件:

```sql
SELECT *
FROM coo1
WHERE col1 IN (SELECT col2
               FROM coo2);
```

下面的语句可以检索出客户的订单数量，子查询语句会对第一个查询检索出的每个客户执行一次:

```sql
SELECT *
FROM coo1
WHERE col1 IN (SELECT col2
               FROM coo2);
```

## 连接

连接用于连接多个表，使用 `JOIN` 关键字，并且条件语句使用 `ON` 而不是 `WHERE`。

连接可以替换子查询，并且比子查询的效率一般会更快。

可以用 `AS` 给列名、计算字段和表名取别名，给表名取别名是为了简化 `SQL` 语句以及连接相同表。

### 内连接

内连接又称等值连接，使用 `INNER JOIN` 关键字。

```sql
SELECT A.value, B.value
FROM tableA AS A INNER JOIN tableB AS B
ON A.key = B.key;
```

可以不明确使用 `INNER JOIN`，而使用普通查询并在 `WHERE` 中将两个表中要连接的列用等值方法连接起来。

```sql
SELECT A.value, B.value
FROM tableA AS A, tableB AS B
WHERE A.key = B.key;
```

在没有条件语句的情况下返回笛卡尔积。

### 自连接

自连接可以看成内连接的一种，只是连接的表是自身而已。

一张员工表，包含员工姓名和员工所属部门，要找出与 Jim 处在同一部门的所有员工姓名。

子查询版本

```sql
SELECT name
FROM employee
WHERE department = (
      SELECT department
      FROM employee
      WHERE name = "Jim");
```

自连接版本

```sql
SELECT e1.name
FROM employee AS e1 INNER JOIN employee AS e2
ON e1.department = e2.department
      AND e2.name = "Jim";
```

### 自然连接

自然连接是把同名列通过等值测试连接起来的，同名列可以有多个。

内连接和自然连接的区别: 内连接提供连接的列，而自然连接自动连接所有同名列。

```sql
SELECT A.value, B.value
FROM tableA AS A NATURAL JOIN tableB AS B;
```

### 外连接

外连接保留了没有关联的那些行。

分为左外连接，右外连接以及全外连接，左外连接就是保留左表没有关联的行。

检索所有顾客的订单信息，包括还没有订单信息的顾客。

```sql
SELECT Customers.cust_id, Orders.order_num
FROM Customers LEFT OUTER JOIN Orders
ON Customers.cust_id = Orders.cust_id;
```

customers 表:

| cust_id | cust_name |
| :-----: | :-------: |
|    1    |     a     |
|    2    |     b     |
|    3    |     c     |

orders 表:

| order_id | cust_id |
| :------: | :-----: |
|    1     |    1    |
|    2     |    1    |
|    3     |    3    |
|    4     |    3    |

结果:

| cust_id | cust_name | order_id |
| :-----: | :-------: | :------: |
|    1    |     a     |    1     |
|    1    |     a     |    2     |
|    3    |     c     |    3     |
|    3    |     c     |    4     |
|    2    |     b     |  `Null`  |

## 组合查询

## 视图

## 存储过程

## 游标

## 触发器

## 事务管理

## 字符集

## 权限管理
