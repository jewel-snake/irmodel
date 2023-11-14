irmodel
=======
irmodel - intermediate representation model
JS модуль, предназначенный для сериолизации данных для сервера.
```javascript
import {create_volume,create_transfer,create_outgo,create_system} from "./irmodel.js"

let v1 = create_volume(2.0,"liver","");

let v2 = create_volume(3,null,null);

let t1 = create_transfer(0.1,v1,v2,"");

let t2 = create_transfer(0.2,v2,v1,"");

let o1 = create_outgo(0.5,v1,"out");

let s = create_system([v1,v2],[t1,t2],[o1],"");
```
данный пример показывает вариант использования всех функций модуля.
JSON объект `s` пригоден для отправки на сервер.

документация к модулю находится в самом файле.
