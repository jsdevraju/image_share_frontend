import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { client, urlFor } from "../client";
import { fetchUser } from "../utlis/fetchUser";
import { IoMdDownload } from "react-icons/io";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  // handle state
  const [postHovered, setPostHovered] = useState();
  const navigate = useNavigate();

  const user = fetchUser();

  //   checking if user saveing post or not
  const alreadySaved = !!save?.filter(
    (item) => item?.postedBy?._id === user?.googleId
  )?.length;

  //   savepin function for
  const savePin = (id) => {
    if (!alreadySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.googleId,
            postedBy: {
              _type: "postedBy",
              _ref: user?.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

//   delete data form db
const deletePin = (id) =>{
    client
    .delete(id)
    .then(() =>{
        window.location.reload();
    })
}
  return (
    <>
      <div className="m-2">
        <div
          onMouseEnter={() => setPostHovered(true)}
          onMouseLeave={() => setPostHovered(false)}
          onClick={() => navigate(`/pin-detail/${_id}`)}
          className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow:hidden transition-all duration-500 ease-in-out"
        >
          <img
            src={urlFor(image).width(250).url()}
            className="rounded-lg w-full"
            alt="User Image"
          />
          {postHovered && (
            <div
              className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
              style={{ height: "100%" }}
            >
              <div className="flex items-center justify-between">
                {/* Download  */}
                <div className="flex gap-2">
                  <a
                    href={`${image?.asset?.url}?dl=`}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                  >
                    <IoMdDownload />
                  </a>
                </div>
                {/* Save Post Count */}
                {alreadySaved ? (
                  <button
                    className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                    type="button"
                  >
                    {save?.length} Saved
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      savePin(_id);
                    }}
                    className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  >
                    Save
                  </button>
                )}
              </div>
              {/* User destination */}
              <div className="flex justify-between items-center gap-2 w-full">
                {destination && (
                  <a
                    href={destination}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white flex items-center gap-2 text-balck font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  >
                    <BsFillArrowUpRightCircleFill />
                    {destination.length > 20
                      ? destination.slice(8, 20)
                      : destination.slice(8)}
                  </a>
                )}
                {postedBy?._id === user?.googleId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePin(_id);
                    }}
                    className="bg-white opacity-70 hover:opacity-100 text-dark font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  >
                      <AiFillDelete />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <Link to={`user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center">
            <img src={postedBy?.image} className='w-8 h-8 rounded-full object-cover' alt="Razu Islam" />
            <p className="font-semibold captalize">{postedBy?.userName ? postedBy?.userName : 'Admin'}</p>
        </Link>
      </div>
    </>
  );
};

export default Pin;
