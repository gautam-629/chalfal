import React, {useState, useEffect}from 'react'
import styles from "./Rooms.module.css";
import RoomCard from "../../components/RoomCard/RoomCard";
import AddRoomModel from '../../components/AddRoomModel/AddRoomModel';
import { getAllRooms } from '../../http';



const Rooms = () => {

  const [showModel, setShowModel] = useState(false)
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
        const { data } = await getAllRooms();
        setRooms(data);
    };
    fetchRooms();
}, []);

  function openModel(){
    setShowModel(true)
  }

//   const rooms = [
//     {
//         id: 1,
//         topic: 'What is the best hiking place near Kathmandu ?',
//         speakers: [
//             {
//                 id: 1,
//                 name: 'John Ghising',
//                 avatar: '/images/monkey-avatar.png',
//             },
//             {
//                 id: 2,
//                 name: 'Prasanna Basnet',
//                 avatar: '/images/monkey-avatar.png',
//             },
//         ],
//         totalPeople: 2,
//     },
//     {
//         id: 3,
//         topic: 'Where is the best swimming pool in Kathmandu',
//         speakers: [
//             {
//                 id: 1,
//                 name: 'Julee Shah',
//                 avatar: '/images/monkey-avatar.png',
//             },
//             {
//                 id: 2,
//                 name: 'Binish Kayastha',
//                 avatar: '/images/monkey-avatar.png',
//             },
//         ],
//         totalPeople: 2,
//     },
    
// ];



  return (
    <>
      <div className="container">
        <div className={styles.roomsHeader}>
          <div className={styles.left}>
            <span className={styles.heading}>All voice rooms</span>
            <div className={styles.searchBox}>
              <img src="/images/search-icon.png" alt="search" />
              <input type="text" className={styles.searchInput} />
            </div>
          </div>
          <div className={styles.right}>
          <button onClick={openModel} className={styles.startRoomButton}>
            <img src="/images/add-room.png" alt="add-room" />
            <span>Start a room</span>
          </button>
        </div>
        </div>
        <div className={styles.roomList}>
                    {rooms.map((room) => (
                        <RoomCard key={room.id} room={room} />
                    ))}
                </div>
      </div>
      {showModel && <AddRoomModel onClose={()=> setShowModel(false)}/> }
     
    </>
    
  )
}

export default Rooms