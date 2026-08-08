// 封装一个时间戳转格式化时间的工具函数（更易维护）
export function formatTimestamp(timestamp) {
  // 第一步：处理时间戳 - 先判断是秒级还是毫秒级（前端时间戳通常是毫秒，后端可能返回秒级）
  let ts = Number(timestamp);
  if (ts.toString().length === 10) { // 秒级时间戳（10位），转毫秒
    ts = ts * 1000;
  }
  
  // 第二步：转成日期对象并格式化（YYYY-MM-DD HH:mm:ss）
  const date = new Date(ts);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，补0
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  // 返回 "YYYY-MM-DD HH:mm:ss" 格式（替代你原来的 replace('T', ' ')）
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}