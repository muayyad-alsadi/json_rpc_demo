export function localDateStr(d, glue="-") {
    if (!d) d=new Date();
    if (typeof d == "number") d=new Date(d);
    const localDate=("0" + d.getDate()).slice(-2);
    const localMoth=("0" + (d.getMonth() + 1)).slice(-2);
    return [d.getFullYear(), localMoth, localDate].join(glue);
}


export function validation_errors_by_field(errors) {
    const ret={};
    let field;
    for (const item of errors) {
        if (item.params) {
            if (item.params.missingProperty) {
                field = item.params.missingProperty;
            } else if (item.params.additionalProperty) {
                field = item.params.additionalProperty;
            } else {
                field = item.dataPath.slice(1);
            }
        } else {
            field = item.dataPath.slice(1);
        }
        ret[field] = ret[field] || [];
        ret[field].push(item);
    }
    return ret;
}

export function formated_validations(errors) {
    const by_field = validation_errors_by_field(errors);
    const ret={};
    for (const [field, ls] of Object.entries(by_field)) {
        ret[field]=ls.map((i)=>i.message);
    }
    return ret;
}

export function validation_msg(errors) {
    const by_field = validation_errors_by_field(errors);
    return Object.entries(by_field).map(([f, l])=>(f+": "+l.map((i)=>i.message).join(","))).join("\n");
}