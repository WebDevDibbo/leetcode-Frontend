import { toast } from "react-toastify";

function Modalbox(props) {

  // or 'details'
  const show = () => {
    document.getElementById("my_modal_1").showModal();
    toast.success('modal opened')
  }

    return (
      <>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        <button
          className="btn"
          onClick={show}
        >
          open modal
        </button>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">
              Press ESC key or click the button below to close
            </p>
            <p className="py-4">
              first modal
            </p>
            <p className="py-4">
              first modalllll
            </p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
                <button
                  className="btn"
                  onClick={() =>
                    document.getElementById("my_modal_2").showModal()
                  }
                >
                  second modal
                </button>
              </form>
            </div>
          </div>
        </dialog>

        {/* second modal */}
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Second Modal</h3>
            <p className="py-4">This is nested inside the first modal.</p>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
                <button onClick={() => document.getElementById("my_modal_1").showModal()} className="btn">prev modal</button>
              </form>
            </div>
          </div>
        </dialog>
      </>
    );
}




export default Modalbox;



// {
//   modalState === "playlists" && (
//     <div className="modal modal-open">
//       <div className="modal-box px-0 py-0 border bg-[#323232] max-w-xs">
//         <h3 className="font-bold text-md pt-5 pl-4 text-white">My Lists</h3>
//         <ul className="mt-3">
//           {
//             playlists.length > 0 &&
//               // <label className="label flex items-center pl-4 py-2 hover:bg-[#424242] w-full">
//               playlists?.map((playlist) => (
//                 <li
//                   className="text-white pl-3 mb-1 flex items-center"
//                   key={playlist._id}
//                 >
//                   <input type="checkbox" className="mr-1" />
//                   {playlist?.title}
//                 </li>
//               ))
//             //{/* </label> */}
//           }
//           <span className="pl-3">
//             {playlists.length === 0 && <span>No Playlist Found</span>}
//           </span>
//         </ul>
//         <div
//           onClick={() => setModalState("create")}
//           className="flex gap-2 items-center mt-6 border-t pl-3 py-2 hover:text-white hover:bg-[#686868]"
//         >
//           <Plus size={18} /> <span> Create a New Playlist </span>{" "}
//         </div>
//         <div className="modal-action mt-0 mb-2 pt-2">
//           <button onClick={() => setModalState(null)} className="btn mr-2">
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// } 




//  {
//    modalState === "create" && (
//      <div className="modal modal-open">
//        <div className="modal-box px-0 py-0 border bg-[#323232] max-w-xs">
//          <h3 className="font-bold flex items-center gap-2 text-md pt-5 pl-4 text-white">
//            <span>
//              <ChevronLeft
//                size={18}
//                onClick={() => setModalState("playlists")}
//              />
//            </span>{" "}
//            <span>Create a new list</span>
//          </h3>
//          <ul className="mt-3 mb-4 mx-3">
//            <label className="label flex items-center py-2">
//              <input
//                value={createValue}
//                onChange={(e) => setCreateValue(e.target.value)}
//                type="text"
//                className="p-2 rounded w-full focus:outline-none bg-zinc-800 focus:ring-0 focus:border-transparent"
//                required
//                placeholder="Enter a list name"
//              />
//            </label>
//          </ul>
//          <div className="mx-3 mb-3 bg-[#898989] text-center rounded">
//            {!loading ? (
//              <button
//                disabled={createValue.length > 0 ? false : true}
//                onClick={() => handleCreatePlaylist(problem.title)}
//                className="p-2 cursor-pointer font-bold  text-black"
//              >
//                Create
//              </button>
//            ) : (
//              <PulseLoader color="green" size={8} />
//            )}
//          </div>
//        </div>
//      </div>
//    );
//  }