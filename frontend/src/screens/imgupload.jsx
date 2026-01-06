import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/auth";
import { getApiUrl } from "../config/api";

const UploadProfileImage = () => {
  const [image, setImage] = useState(null);
  const { getToken, SetImg } = useAuth();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleUpload = async () => {
    if (!image) return;

    try {
        const config = {
            headers: {
              "Content-type": "application/json"
            }
          };

        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = async () => {

                const base64Image = reader.result.split(",")[1];

                const token = getToken();
                console.log(token);
                
                const response = await axios.post(
                    getApiUrl("api/users/imgUpload"), 
                    {
                    token: token,
                    Img: base64Image,
                    },
                    config
                );

                SetImg(base64Image)
            };
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle error, e.g., show error message to user
    }
  };

  return (
    <div className="flex flex-col mt-3 items-center">
      <input type="file" accept="image/*" onChange={handleImageChange} className=" bg-slate-200 rounded-full border-2 text-sm font-normal text-slate-800 border-slate-900"/>
      <button onClick={handleUpload} className="text-lg font-semibold bg-slate-500 border-1 rounded-lg w-fit mt-3 px-6" >Upload</button>
    </div>
  );
};

export default UploadProfileImage;
