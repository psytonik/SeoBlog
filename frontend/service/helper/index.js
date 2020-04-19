/**
 * TIME
 * @returns {string|number}
 */
export const time = () => {
    let now = new Date().getHours();
    if( now === 0 || now === 1 || now === 2 || now === 3 || now === 4 || now === 5 ){
        return 'Night'
    }
    if( now === 6 || now === 7 || now === 8 || now === 9 || now === 10 || now === 11 ){
        return 'Morning'
    }
    if( now === 12 || now ===13 || now === 14 || now === 15 || now === 16 || now === 17 ){
        return 'Day'
    }
    if( now === 18 || now === 19 || now === 20 || now === 21 || now === 22 || now === 23 ){
        return 'Evening'
    }
    return now;
};
