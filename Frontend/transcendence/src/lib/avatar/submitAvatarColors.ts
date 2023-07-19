export {}

// export default async function submitAvatarColors(
//   border: string,
//   background: string,
//   token: string
// ) {
//   try {
//     const response = await fetch(`http://${process.env.HOST_IP}:4000/api/avatar`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + token,
//       },
//       body: JSON.stringify({
//         border,
//         background,
//       }),
//     });

//     const data = await response.json(); // checking

//     return "";
//   } catch (e) {
//     console.log(e);
//     return "Something wrong in submit avatar colors";
//   }
// }
