import React, { useState, useEffect, useRef, useMemo } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { API } from "../config/api";
import NavBar from "./NavBar";
import BK from "../assets/BK.png";
import Upload from "../assets/upload.png";
import Cam from "../assets/cam.png";
import Plus from "../assets/plus.png";
import Mockup from "../assets/mockup.png";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function EditProfile() {
  const [state, dispatch] = useContext(UserContext);
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    document.title = "Edit Profile";
  }, []);

  const wrapperRef = useRef(null);

  const [draggable] = useState(true);
  const [position, setPosition] = useState([-6.3818149, 106.7495821]);
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );

  var positionStr = `${position.lat}, ${position.lng}`;

  const [form, setForm] = useState({
    fullName: "",
    image: "",
    email: "",
    phone: "",
    location: positionStr,
  });

  const idid = state?.user.id;

  let { data: user } = useQuery("userCache", async () => {
    const response = await API.get("/user/" + idid);
    return response.data.data;
  });

  useEffect(() => {
    if (user) {
      setForm({
        ...form,
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        phone: user.phone,
        location: positionStr,
      });
    }
  }, [user]);

  // const handleChange = (e) => {
  //   setForm({
  //     ...form,
  //     [e.target.name]:
  //       e.target.type === "file" ? e.target.files[0] : e.target.value,
  //   });

  //   if (e.target.type == "file") {
  //     const url = URL.createObjectURL(e.target.files[0]);
  //     setPreview(url);
  //   }
  // };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      if (preview) {
        formData.set("image", form?.image, form?.image.name);
      }
      formData.set("fullName", form.fullName);
      formData.set("email", form.email);
      formData.set("phone", form.phone);
      formData.set("location", positionStr);

      const response = await API.patch(`/user/${idid}`, formData);

      const auth = await API.get("/check-auth");

      let payload = auth.data.data;

      dispatch({
        type: "USER_SUCCESS",
        payload,
      });

      navigate("/my-profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <NavBar />
      <div
        className="mx-auto d-flex mt-4"
        style={{
          height: "90%",
          width: "65%",
        }}
      >
        <div
          className="d-flex flex-column ms-5"
          style={{
            width: "45%",
          }}
        >
          <div
            style={{
              border: "2px dashed grey",
              width: "100%",
              height: "400px",
              borderRadius: "20px",
            }}
            className="d-flex flex-column justify-content-center align-items-center"
          >
            <img src={Upload} alt="aw" width="150px"></img>
            <p>Browse to choose a Project</p>
          </div>
          <div className="d-flex justify-content-evenly">
            <div
              style={{
                border: "2px dashed grey",
                width: "23%",
                height: "90px",
                borderRadius: "20px",
              }}
              className="d-flex flex-column justify-content-center align-items-center mt-2"
            >
              <img src={Plus} alt="aw" width="30px"></img>
            </div>
            <div
              style={{
                border: "2px dashed grey",
                width: "23%",
                height: "90px",
                borderRadius: "20px",
              }}
              className="d-flex flex-column justify-content-center align-items-center mt-2"
            >
              <img src={Plus} alt="aw" width="30px"></img>
            </div>
            <div
              style={{
                border: "2px dashed grey",
                width: "23%",
                height: "90px",
                borderRadius: "20px",
              }}
              className="d-flex flex-column justify-content-center align-items-center mt-2"
            >
              <img src={Plus} alt="aw" width="30px"></img>
            </div>
            <div
              style={{
                border: "2px dashed grey",
                width: "23%",
                height: "90px",
                borderRadius: "20px",
              }}
              className="d-flex flex-column justify-content-center align-items-center mt-2"
            >
              <img src={Plus} alt="aw" width="30px"></img>
            </div>
          </div>
        </div>
        <div
          style={{ width: "50%" }}
          className="d-flex flex-column justify-content-center align-items-center mb-5"
        >
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={6}
              placeholder="Description"
              style={{ backgroundColor: "#F4F4F4", width:"300px" }}
            />
          </Form.Group>
          <div className="d-flex justify-content-center" style={{width:"100%"}}>
          <Button
            type="submit"
            style={{ width: "20%", background: "#E7E7E7", border: "none", color:"black" }}
            className="mt-3 mx-3"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            style={{ width: "20%", background: "#2FC4B2", border: "none" }}
            className="mt-3 mx-3"
          >
            Post
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
