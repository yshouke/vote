export const treeFindItemById = (data: any, id: number | string, cb=(_v: any,i: any)=>{}, alias={key: 'id', child: 'child'}) => {
    if (!data?.length) return ;
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        cb(element, index)
        // deptMap[element.id] = element;
        if (element[alias.key] === id) return;
        element[alias.child] && treeFindItemById(element[alias.child], id, cb, alias) 
    }
}