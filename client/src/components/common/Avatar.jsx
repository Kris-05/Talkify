import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa"
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

function Avatar({ type, image, setImage }) {

  const [hover, setHover] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible ] = useState(false);
  const [contextMenuLocation, setContextMenuLocation] = useState({
    x: 0,
    y: 0
  });
  const [grabPhoto, setGrabPhoto] = useState(false);
  const [showPhotoLib, setShowPhotoLib] = useState(false);
  const [showCapturePic, setShowCapturePic] =useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setIsContextMenuVisible(true);
    setContextMenuLocation({
      x: e.pageX,
      y: e.pageY
    })
  }

  useEffect(() => {
    if(grabPhoto) {
      const data = document.getElementById("photo-picker");
      data.click(); // Programmatically opens the file input dialog.

      // listens for when the browser window regains focus, which usually 
      // happens after a file is selected or the dialog is dismissed.
      document.body.onfocus = (e) =>{
        /*
        To give the file input enough time to register a file selection or handle the dismissal of the file dialog.
         Without this delay, the state might reset too quickly, potentially interfering with the file selection process or dismissing the dialog prematurely.
        */
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      }
    }
  }, [grabPhoto])

  const contextMenuOptions = [
    {
      name: "Take Photo", 
      callback: () => {
        setShowCapturePic(true);
      }
    },
    {
      name: "Choose From Library", 
      callback: () => {
        setShowPhotoLib(true);
      }
    },
    {
      name: "Upload Photo", 
      callback: () => {
        setGrabPhoto(true);
      }
    },
    {
      name: "Remove Photo", 
      callback: () => {
        setImage("/default_avatar.png")
      }
    },
  ];

  const photoPickerChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(); // Uses a FileReader to convert the file into a data URI
    const data = document.createElement("img");

    // console.log(data);
    
    reader.onload = function(event) {
      data.src = event.target.result; // Sets the image source to the file's data URI.
      data.setAttribute("data-src", event.target.result); // Adds a custom attribute to store the data URI.
    }
    reader.readAsDataURL(file); // Reads the file as a data URI.

    // The FileReader works asynchronously. This delay ensures that the reader.onload callback 
    // has enough time to execute and set the data.src before it is used in setImage.
    setTimeout(() => {
      setImage(data.src);
    }, 100);
  }

  return <>
    <div className="flex items-center justify-center">
      {type === "sm" && (
        <div className="relative h-10 w-10">
          <Image src={image} alt="avatar" className="rounded-full" fill/>
        </div>  
      )}
      {type === "lg" && (
        <div className="relative h-14 w-14">
          <Image src={image} alt="avatar" className="rounded-full" fill/>
        </div>  
      )}
      {type === "xl" && (
        <div className="relative cursor-pointer z-0" 
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className={`z-10 bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 flex items-center justify-center 
          rounded-full flex-col text-center gap-2 ${hover?"visible":"hidden"}
              `}
            id="context-opener"
            onClick={(e) => showContextMenu(e)}
          >
            <FaCamera className="text-2xl" id="context-opener" onClick={(e) => showContextMenu(e)} />
            <span>
              Change <br/> Profile <br/> Photo
            </span>
          </div>
          <div className="flex items-center justify-center h-60 w-60">
            <Image src={image} alt="avatar" className="rounded-full" fill/>
          </div>  
        </div>
      )}
    </div>
    {isContextMenuVisible && ( 
      <ContextMenu
        options={contextMenuOptions}
        coordinates={contextMenuLocation}
        contextMenu={isContextMenuVisible}
        setContextMenu={setIsContextMenuVisible}
      />
    )}
    {showCapturePic && (
      <CapturePhoto setImage={setImage} hide={setShowCapturePic} />
    )}
    {grabPhoto && (
      <PhotoPicker onChange={photoPickerChange} />
    )}
    {showPhotoLib && (
      <PhotoLibrary setImage={setImage} hidePhotoLibrary={setShowPhotoLib} />
    )}
  </>
}

export default Avatar;
