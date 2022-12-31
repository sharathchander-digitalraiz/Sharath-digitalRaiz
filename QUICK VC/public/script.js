const socket = io("/");
const mypeer = new Peer(undefined, {
  host: "/",
  port: "3001"
})

mypeer.on('open', (id)=>{
  socket.emit('join-room', ROOM_ID, id)
})

socket.on('user-connected', (userId)=>{
  console.log("User connected" + userId)
})
// let myVideoStream;
// navigator.mediaDevices
//   .getUserMedia({ audio: true, video: true })
//   .then((stream) => {
//     myVideoStream = stream;
//     addVideoStream(myVideo, stream);
//     peer.on("call", (call) => {
//       call.answer(stream);
//       const video = document.createElement("video");
//       call.on("stream", (userVideoStream) => {
//         addVideoStream(video, userVideoStream);
//       });
//     });
//     socket.on("user-connected", (userId) => {
//       connectToNewUser(userId, stream);
//     });
//   });
// const connectToNewUser = (userId, stream) => {
//   const call = peer.call(userId, stream);
//   const video = document.createElement("video");
//   call.on("stream", (userVideoStream) => {
//     addVideoStream(video, userVideoStream);
//   });
// };
// peer.on("open", (id) => {
//   socket.emit("join-room", ROOM_ID, id);
// });
// const addVideoStream = (video, stream) => {
//   video.srcObject = stream;
//   video.addEventListener("loadedmetadata", () => {
//     video.play();
//     videoGrid.append(video);
//   });
// };
