// const CustomizedContent = ({ x, y, width, height, index, departmentData }) => {
//   const isTooSmall = width < 130; // Đặt ngưỡng cho chiều rộng
//   const COLORS = ['#494764', '#5a5279', '#6f6594', '#8075ab', '#a192db', '#6df684', '#e16969'];

//   const department = departmentData[index];

//   if (!department) {
//     return null; // Trả về null nếu không có department tương ứng
//   }

//   return (
//     <g>
//       <rect
//         x={x}
//         y={y}
//         width={width}
//         height={height}
//         style={{
//           fill: COLORS[index % COLORS.length],
//           stroke: '#fff',
//           strokeWidth: 4,
//         }}
//       />
//       <text
//         x={x + width / 2}
//         y={y + height / 2 - 10} // Điều chỉnh vị trí y để các dòng không chồng lên nhau
//         textAnchor="middle"
//         fontSize='12'
//         fill="#fff"
//         transform={isTooSmall ? `rotate(-90, ${x + width / 2}, ${y + height / 2})` : ''}
//       >
//         {department.name}
//       </text>
//       <text
//         x={x + width / 2}
//         y={y + height / 2 + 10} // Đặt vị trí y của dòng thứ hai
//         textAnchor="middle"
//         fill="#fff"
//         transform={isTooSmall ? `rotate(-90, ${x + width / 2}, ${y + height / 2})` : ''}
//       >
//         ({department.size})
//       </text>
// s

//     </g>
//   );
// };
// export default CustomizedContent 
