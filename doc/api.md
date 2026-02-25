---
title: 默认模块
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# 默认模块

Base URLs:

# Authentication

# tmms计量/产品接口/通用/配置相关

## GET 获取计量通用配置

GET /tmms_config/get_tmms_config

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX25hbWUiOls5OSwxMTEsMTEwLDEwMiwxMDUsMTAzLDExNiw5NywxMjIsMTA0XX0.rmC9hAtDRlfqKTAdQEOUWQebMt7aUMA90Cm2L8dDCYQ|
|Content-Type|header|string| 否 |application/json|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "data": [
    {
      "measure_result_title_name": {
        "id": "id",
        "mainfold_num": "管汇号",
        "result_year": "年",
        "result_month": "月",
        "result_day": "日",
        "oil": "产油",
        "create_time": "统计时间"
      },
      "plan_table_name": "t_meter_plan_fc",
      "result_data_table_name": "t_meter_result_data_fc",
      "xlsx_column_name": {
        "station_id": {
          "title_name": "计量站",
          "value_type": "string"
        },
        "mainfold_num": {
          "title_name": "通道号",
          "value_type": "int"
        },
        "date": {
          "value_type": "now_day"
        },
        "plan": {
          "title_name": "计量(0:禁止 1:允许)",
          "value_type": "int",
          "check": {
            "step": 1,
            "range": [
              0,
              1
            ]
          }
        },
        "plan_time": {
          "title_name": "计量时间",
          "value_type": "int",
          "check": {
            "step": 10,
            "range": [
              0,
              90
            ]
          }
        },
        "plan_sort": {
          "title_name": "排序",
          "value_type": "int"
        },
        "remark": {
          "title_name": "备注",
          "value_type": "string"
        }
      }
    }
  ],
  "message": "ok"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|[object]|true|none||none|
|»» measure_result_title_name|object|false|none||none|
|»»» id|string|true|none||none|
|»»» mainfold_num|string|true|none||none|
|»»» result_year|string|true|none||none|
|»»» result_month|string|true|none||none|
|»»» result_day|string|true|none||none|
|»»» oil|string|true|none||none|
|»»» create_time|string|true|none||none|
|»» plan_table_name|string|false|none||none|
|»» result_data_table_name|string|false|none||none|
|»» xlsx_column_name|object|false|none||none|
|»»» station_id|object|true|none||none|
|»»»» title_name|string|true|none||none|
|»»»» value_type|string|true|none||none|
|»»» mainfold_num|object|true|none||none|
|»»»» title_name|string|true|none||none|
|»»»» value_type|string|true|none||none|
|»»» date|object|true|none||none|
|»»»» value_type|string|true|none||none|
|»»» plan|object|true|none||none|
|»»»» title_name|string|true|none||none|
|»»»» value_type|string|true|none||none|
|»»»» check|object|true|none||none|
|»»»»» step|integer|true|none||none|
|»»»»» range|[integer]|true|none||none|
|»»» plan_time|object|true|none||none|
|»»»» title_name|string|true|none||none|
|»»»» value_type|string|true|none||none|
|»»»» check|object|true|none||none|
|»»»»» step|integer|true|none||none|
|»»»»» range|[integer]|true|none||none|
|»»» plan_sort|object|true|none||none|
|»»»» title_name|string|true|none||none|
|»»»» value_type|string|true|none||none|
|»»» remark|object|true|none||none|
|»»»» title_name|string|true|none||none|
|»»»» value_type|string|true|none||none|
|» message|string|true|none||none|

## GET 获取表列名

GET /tmms_config/get_table_column

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|table_name|query|string| 否 |none|
|type|query|string| 否 |none|
|Authorization|header|string| 否 |Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX25hbWUiOls5OSwxMTEsMTEwLDEwMiwxMDUsMTAzLDExNiw5NywxMjIsMTA0XX0.rmC9hAtDRlfqKTAdQEOUWQebMt7aUMA90Cm2L8dDCYQ|
|Content-Type|header|string| 否 |application/json|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "data": {
    "column": [
      {
        "column_name": "station_id"
      },
      {
        "column_name": "mainfold_num"
      },
      {
        "column_name": "date"
      },
      {
        "column_name": "remark"
      },
      {
        "column_name": "sign"
      },
      {
        "column_name": "plan"
      },
      {
        "column_name": "plan_time"
      },
      {
        "column_name": "plan_sort"
      },
      {
        "column_name": "modified_time"
      },
      {
        "column_name": "create_time"
      }
    ]
  },
  "message": "ok"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|object|true|none||none|
|»» column|[object]|true|none||none|
|»»» column_name|string|true|none||none|
|» message|string|true|none||none|

## GET 获取所有表名

GET /tmms_config/get_all_table_name

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX25hbWUiOls5OSwxMTEsMTEwLDEwMiwxMDUsMTAzLDExNiw5NywxMjIsMTA0XX0.rmC9hAtDRlfqKTAdQEOUWQebMt7aUMA90Cm2L8dDCYQ|
|Content-Type|header|string| 否 |application/json|

> 返回示例

> 200 Response

```json
{
  "code": 0,
  "data": {
    "table_names": [
      "t_basic_meter_tag_info",
      "t_basic_sys_config",
      "t_meter_group_station",
      "behavior_tree",
      "behavior_group",
      "behavior_canvas",
      "behavior",
      "t_meter_station_ex",
      "web_api_config",
      "t_meter_emphasis_plan_bkq",
      "t_meter_station_ex_old",
      "t_meter_plan_fc",
      "t_meter_plan_xg",
      "t_meter_station_ex_config",
      "t_meter_result_data_hys",
      "t_meter_result_data_xg",
      "t_meter_result_data",
      "t_meter_result_data_bkq",
      "t_meter_plan_bkq",
      "t_meter_emphasis_plan",
      "t_meter_auto_measure",
      "t_meter_plan",
      "t_meter_result_data_fc",
      "t_meter_result_data_extend_args"
    ]
  },
  "message": "ok"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» code|integer|true|none||none|
|» data|object|true|none||none|
|»» table_names|[string]|true|none||none|
|» message|string|true|none||none|

## POST 保存计划相关配置

POST /tmms_config/update_tmms_config_plan

> Body 请求参数

```json
{
  "plan_table_name": "table_name",
  "xlsx_column_name": {
    "station_id": {
      "title_name": "计量站",
      "value_type": "string"
    },
    "mainfold_num": {
      "title_name": "通道号",
      "value_type": "int"
    },
    "date": {
      "value_type": "now_day"
    },
    "plan": {
      "title_name": "计量(0:禁止 1:允许)",
      "value_type": "int",
      "check": {
        "step": 1,
        "range": [
          0,
          1
        ]
      }
    },
    "plan_time": {
      "title_name": "计量时间",
      "value_type": "int",
      "check": {
        "step": 10,
        "range": [
          0,
          90
        ]
      }
    },
    "plan_sort": {
      "title_name": "排序",
      "value_type": "int"
    },
    "remark": {
      "title_name": "备注",
      "value_type": "string"
    }
  }
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX25hbWUiOls5OSwxMTEsMTEwLDEwMiwxMDUsMTAzLDExNiw5NywxMjIsMTA0XX0.rmC9hAtDRlfqKTAdQEOUWQebMt7aUMA90Cm2L8dDCYQ|
|Content-Type|header|string| 否 |application/json|
|body|body|object| 是 |none|
|» plan_table_name|body|string| 是 |none|
|» xlsx_column_name|body|object| 是 |none|
|»» station_id|body|object| 是 |none|
|»»» title_name|body|string| 是 |none|
|»»» value_type|body|string| 是 |none|
|»» mainfold_num|body|object| 是 |none|
|»»» title_name|body|string| 是 |none|
|»»» value_type|body|string| 是 |none|
|»» date|body|object| 是 |none|
|»»» value_type|body|string| 是 |none|
|»» plan|body|object| 是 |none|
|»»» title_name|body|string| 是 |none|
|»»» value_type|body|string| 是 |none|
|»»» check|body|object| 是 |none|
|»»»» step|body|integer| 是 |none|
|»»»» range|body|[integer]| 是 |none|
|»» plan_time|body|object| 是 |none|
|»»» title_name|body|string| 是 |none|
|»»» value_type|body|string| 是 |none|
|»»» check|body|object| 是 |none|
|»»»» step|body|integer| 是 |none|
|»»»» range|body|[integer]| 是 |none|
|»» plan_sort|body|object| 是 |none|
|»»» title_name|body|string| 是 |none|
|»»» value_type|body|string| 是 |none|
|»» remark|body|object| 是 |none|
|»»» title_name|body|string| 是 |none|
|»»» value_type|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## POST 保存结果相关配置

POST /tmms_config/update_tmms_config_result

> Body 请求参数

```json
{
  "result_data_table_name": "table_name",
  "measure_result_title_name": {
    "id": "id",
    "mainfold_num": "管汇号",
    "result_year": "年",
    "result_month": "月",
    "result_day": "日",
    "oil": "产油",
    "create_time": "统计时间"
  }
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX25hbWUiOls5OSwxMTEsMTEwLDEwMiwxMDUsMTAzLDExNiw5NywxMjIsMTA0XX0.rmC9hAtDRlfqKTAdQEOUWQebMt7aUMA90Cm2L8dDCYQ|
|Content-Type|header|string| 否 |application/json|
|body|body|object| 是 |none|
|» result_data_table_name|body|string| 是 |none|
|» measure_result_title_name|body|object| 是 |none|
|»» id|body|string| 是 |none|
|»» mainfold_num|body|string| 是 |none|
|»» result_year|body|string| 是 |none|
|»» result_month|body|string| 是 |none|
|»» result_day|body|string| 是 |none|
|»» oil|body|string| 是 |none|
|»» create_time|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 数据模型

