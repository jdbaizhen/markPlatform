export const setSession = ( key, value ) =>  {
    if( typeof value === 'object'){
        value = JSON.stringify( value )
    }
    sessionStorage.setItem( key, value )
}

export const getSession = ( key ) => {
    let value = sessionStorage.getItem( key )
    if (/^\{/.test(value)) {
		value = JSON.parse(value)
    }
    return value
} 

export const removeSession = ( key ) => {
    sessionStorage.removeItem( key )
}