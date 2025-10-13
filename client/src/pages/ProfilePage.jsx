import { useContext, useState } from "react";
import * as ExifReader from "exifreader";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import assets from "../assets/assets";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  console.log("Authenticated User:", authUser);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageMetadata, setImageMetadata] = useState(null);
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const navigate = useNavigate();

  const extractExifData = async (file) => {
    try {
      const tags = ExifReader.load(file);

      const metadata = {
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(2)} KB`,
        fileType: file.type,
        lastModified: new Date(file.lastModified).toLocaleString(),
        width: tags["Image Width"]?.value || "N/A",
        height: tags["Image Height"]?.value || "N/A",
        cameraMake: tags["Make"]?.description || "N/A",
        cameraModel: tags["Model"]?.description || "N/A",
        dateTime: tags["DateTime"]?.description || "N/A",
        orientation: tags["Orientation"]?.description || "N/A",
        fNumber: tags["FNumber"]?.description || "N/A",
        exposureTime: tags["ExposureTime"]?.description || "N/A",
        iso: tags["ISOSpeedRatings"]?.description || "N/A",
        focalLength: tags["FocalLength"]?.description || "N/A",
        flash: tags["Flash"]?.description || "N/A",
        gpsLatitude: tags["GPSLatitude"]?.description || "N/A",
        gpsLongitude: tags["GPSLongitude"]?.description || "N/A",
        gpsAltitude: tags["GPSAltitude"]?.description || "N/A",
        software: tags["Software"]?.description || "N/A",
        artist: tags["Artist"]?.description || "N/A",
        copyright: tags["Copyright"]?.description || "N/A",
      };

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📸 IMAGE METADATA DETAILS");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

      console.log("\n📁 FILE INFORMATION:");
      console.log("  File Name:", metadata.fileName);
      console.log("  File Size:", metadata.fileSize);
      console.log("  File Type:", metadata.fileType);
      console.log("  Last Modified:", metadata.lastModified);

      console.log("\n📐 IMAGE DIMENSIONS:");
      console.log("  Width:", metadata.width);
      console.log("  Height:", metadata.height);
      console.log("  Orientation:", metadata.orientation);

      console.log("\n📷 CAMERA INFORMATION:");
      console.log("  Make:", metadata.cameraMake);
      console.log("  Model:", metadata.cameraModel);
      console.log("  Date/Time:", metadata.dateTime);
      console.log("  Software:", metadata.software);

      console.log("\n⚙️ CAMERA SETTINGS:");
      console.log("  F-Number (Aperture):", metadata.fNumber);
      console.log("  Exposure Time:", metadata.exposureTime);
      console.log("  ISO:", metadata.iso);
      console.log("  Focal Length:", metadata.focalLength);
      console.log("  Flash:", metadata.flash);

      console.log("\n🌍 GPS LOCATION:");
      console.log("  Latitude:", metadata.gpsLatitude);
      console.log("  Longitude:", metadata.gpsLongitude);
      console.log("  Altitude:", metadata.gpsAltitude);

      if (metadata.gpsLatitude !== "N/A" && metadata.gpsLongitude !== "N/A") {
        const googleMapsUrl = `https://www.google.com/maps?q=${metadata.gpsLatitude},${metadata.gpsLongitude}`;
        console.log("  Google Maps Link:", googleMapsUrl);
      }

      console.log("\n👤 CREATOR INFORMATION:");
      console.log("  Artist:", metadata.artist);
      console.log("  Copyright:", metadata.copyright);

      console.log("\n📋 RAW EXIF DATA:");
      console.log(tags);

      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

      setImageMetadata(metadata);
      return metadata;
    } catch (error) {
      console.error("❌ Error reading EXIF data:", error);
      console.log("ℹ️ This image might not contain EXIF metadata");
      return null;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      await extractExifData(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!selectedImage){
      updateProfile({ fullName:name, bio });
      navigate("/");
      return
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onload = async () => {
        const base64Image = reader.result;
        updateProfile({ fullName: name, bio, profilePic: base64Image });
        navigate("/");
      }

    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800/50 backdrop-blur-xl text-gray-300 border-2 border-gray-600 rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row-reverse items-center">
          <div className="p-8 flex items-center justify-center md:w-1/3">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
              <img src={authUser.profilePic || assets.avatar_icon} alt="" className="rounded-full"/>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-8 md:w-2/3">
            <h3 className="text-2xl font-bold text-white mb-2">Profile Details</h3>

            <label
              htmlFor="avatar"
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
            >
              <input
                type="file"
                onChange={handleImageChange}
                id="avatar"
                accept=".png,.jpg,.jpeg"
                hidden
              />
              <img
                src={
                  selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M12 6v12M6 12h12'/%3E%3C/svg%3E"
                }
                alt="avatar"
                className={`w-14 h-14 object-cover border-2 border-violet-500 ${
                  selectedImage ? "rounded-full" : "rounded-lg"
                }`}
              />
              <span className="text-violet-400 hover:text-violet-300">Upload Profile Image</span>
            </label>

            {imageMetadata && (
              <div className="bg-gray-700/50 p-3 rounded-lg text-xs">
                <p className="text-green-400 mb-2">
                  ✅ Metadata extracted! Check console for details.
                </p>
                <p>📷 Camera: {imageMetadata.cameraModel}</p>
                <p>
                  📏 Size: {imageMetadata.width} x {imageMetadata.height}
                </p>
                <p>
                  📍 Location: {imageMetadata.gpsLatitude !== "N/A" ? "Available" : "Not Available"}
                </p>
              </div>
            )}

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              placeholder="Your Name"
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white"
            />

            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              placeholder="Write bio Profile"
              required
              className="p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white resize-none"
              rows={4}
            />

            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white p-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Save Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
