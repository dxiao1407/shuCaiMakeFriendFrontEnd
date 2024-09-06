// utils.js
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() 返回值是 0-11 之间，所以需要加 1
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${year}年${month}月${day}日${hours}点${minutes}分`;
};