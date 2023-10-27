// модуль irmodel
// предназначен для подготовки данных к отправке на сервер.
// модуль предоставляет функции конструкторы, которые проверяют данные на соответствие типов,
// и оборачивает их в JSON объекты таким образом, чтобы их можно было десериализовать
// на сервере. библиотека не проверяет модель на корректность - это делает сервер -
// однако, если модуль используется правильно и по назначению, то получившаяся модель не
// нарушает целостность данных. тип объекта определяется полем `__"тип объекта"__:true`
// о строках:
// все аргументы, которые должны быть строчного типа не обязательны для работы с моделями, 
// они введены для удобства конечного пользователя, если они имеют некорректный тип,
// они заменяются на пустую строку.
// о коэффициентах:
// все коэффициенты обязательны для работы моделей, однако они могут иметь тип null, если планируется 
// для их поиска воспользоваться оптимизацией.
// о `to` и `from`:
// эти параметры нужны для указания направления обменов между телами.
// данные параметры обязательны, и должны являться JSON объектами, создаными функцией create_volume.
// все объекты, которые есть в модели, необходимо передать в функцию create_system, иначе целостность
// будет нарушена(например,в системе есть обмен между телами, одно из которых не существует в системе)
// изменять значения полей объектов, равно кака добавлять свои собственные запрещено, такие объекты будут отвергнуты
// сервером.


function uuid() {
  return crypto.randomUUID().replaceAll('-','');
}

// create_volume
// value - значение объёма тела. может принимать значение null.
// name - имя тела, не влияет на модель, введено для удобства конечного пользователя. опциональное поле. 
//   если тип аргумента не является строкой, он заменяется на пустую строку.
// comment - строка с пояснениями, опциональное поле. если тип аргумента не строка, аргумент заменяется на пустую строку.
// функция создаёт JSON объект, представляющий тело. его можно послать на сервер, т.к. он является JSON-ном, а так же использовать
// в других функциях данного модуля
export function create_volume(value,name,comment) {
  if (typeof value !== "number" && value != null) {
    console.log("value must be a number");
    return null;
  }
  if (typeof name !== "string") {
    console.log("name must be a string. ignoring.");
    name = "";
  }
  if (typeof comment !== "string") {
    console.log("comment must be a string. ignoring.");
    comment = "";
  }
  return {"__volume__":true,"value":value,"name":name,"comment":comment,"id":uuid()};
}

// create_outgo
// value - значение коэффициента оттока во внешнюю среду
// from - JSON объект, созданный при помощи функции create_volume, тело, из которого расходуется вещество
// comment - строка с комментарием. правила для всех строк
// функция создания объекта, обозначающего обмен с внешней средой
export function create_outgo(value,from,comment) {
  if (typeof value !== "number" && value != null) {
    console.log("value must be a number");
    return null;
  }
  if (!from.__volume__) {
    console.log("from parameter must be a volume");
    return null;
  }
  if (typeof comment !== "string") {
    console.log("comment must be a string. ignoring.");
    comment = "";
  }
  return {"__outgo__":true,"value":value,"from_id":from.id,"comment":comment,"id":uuid()};
}

// create_transfer
// value - значение коэффициента объмена между телами
// from - тело, из которого уходит вещество
// to - тело, в которое приходит вещество
// comment - строка с комментарием
// функция создаёт объект, представляющий обмен между телами
export function create_transfer(value,from,to,comment) {
  if (typeof value !== "number" && value != null) {
    console.log("value must be a number");
    return null;
  }
  if (!from.__volume__) {
    console.log("from parameter must be a volume");
    return null;
  }
  if (!to.__volume__) {
    console.log("to parameter must be a volume");
    return null;
  }
  if (to.id == from.id) {
    console.log("can not create transfer with from and to parameters pointing to the same volume");
    return null;
  }
  if (typeof comment !== "string") {
    console.log("comment must be a string. ignoring.");
    comment = "";
  }
  return {"__transfer__":true,"value":value,"from_id":from.id,"to_id":to.id,"comment":comment,"id":uuid()};
}

// create_system
// volume - массив тел, входящих в систему
// transfers - массив обменов в системе
// outgos - массив обменов с внешней средой
// comment - строка с пояснением
// создаёт систему. все типы объектов проверяются. целостность системы не проверяется, это делает сервер
export function create_system(volumes,transfers,outgos,comment) {
  if (typeof comment !== "string") {
    console.log("comment must be a string. ignoring.");
    comment = "";
  }
  const isVolume = (item) => item.__volume__;
  const isTransfer = (item) => item.__transfer__;
  const isOutgo = (item) => item.__outgo__;
  if (!volumes.every(isVolume)) {
    console.log("volumes parameter must be array of volume objects");
    return null;
  }
  if (!transfers.every(isTransfer)) {
    console.log("transfers parameter must be array of transfer objects");
    return null;
  }
  if (!outgos.every(isOutgo)) {
    console.log("outgos parameter must be array of outgo objects");
    return null;
  }
  if (typeof comment !== "string") {
    console.log("comment must be a string. ignoring.");
    comment = "";
  }
  return {"__system__":true,"volumes":volumes,"transfers":transfers,"outgos":outgos,"comment":comment};
}
