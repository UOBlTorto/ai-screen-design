export function debounce(fn,ms){
    let time
    return function(this,...args){
        const ctx = this
        clearTimeout(time)
        time = setTimeout(()=>fn.apply(this,args),ms)

    }
}