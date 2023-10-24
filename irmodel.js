function uuid() {
  return crypto.randomUUID().replaceAll('-','');
}

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
