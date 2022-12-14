import React, { useState, useEffect, useRef, useMemo } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { API } from "../config/api";
import NavBar from "./NavBar";
import Cam from "../assets/cam.png";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import InputGroup from "react-bootstrap/InputGroup";

function EditProfile() {
  const [state, dispatch] = useContext(UserContext);
  const [preview, setPreview] = useState(null);
  const [preview1, setPreview1] = useState(null);
  const navigate = useNavigate();

  const navigateProfile = () => {
    navigate("/my-profile");
  };

  useEffect(() => {
    document.title = "Edit Profile";
  }, []);

  const [form, setForm] = useState({
    name: "",
    image: "",
    greeting: "",
    bestArt: "",
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
        name: user.name,
        image: user.image,
        greeting: user.greeting,
        bestArt: user.bestArt,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });

    if (e.target.type == "file") {
      const url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleChange1 = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files[0] : e.target.value,
    });

    if (e.target.type == "file") {
      const url = URL.createObjectURL(e.target.files[0]);
      setPreview1(url);
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      if (preview) {
        formData.set("image", form?.image, form?.image.name);
      }
      if (preview1) {
        formData.set("bestArt", form?.bestArt, form?.bestArt.name);
      }
      formData.set("name", form.name);
      formData.set("greeting", form.greeting);

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
        className="mx-auto d-flex mt-5"
        style={{
          height: "90%",
          width: "65%",
        }}
      >
        <div
          className="d-flex"
          style={{
            width: "45%",
          }}
        >
          {preview1 ? (
            preview1 && (
              <div className="mb-3">
                <img
                  src={preview1}
                  style={{
                    width: "100%",
                    height: "400px",
                    objectFit: "cover",
                    borderRadius: "20px",
                  }}
                  alt={preview1}
                />
              </div>
            )
          ) : (
            <label
              htmlFor="bestart"
              style={{
                width: "100%",
                height: "400px",
                borderRadius: "20px",
              }}
            >
              <div
                style={{
                  border: "2px dashed grey",
                  width: "100%",
                  height: "400px",
                  borderRadius: "20px",
                }}
                className="d-flex justify-content-center align-items-center"
                htmlFor="bestart"
              >
                <input
                  type="file"
                  id="bestart"
                  name="bestArt"
                  hidden
                  onChange={handleChange1}
                />
                <p className="fs-5"><span style={{color:"#2FC4B2"}}>Upload</span> Best Your Art</p>
              </div>
            </label>
          )}
        </div>
        <div
          style={{ width: "50%" }}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          {preview ? (
            preview && (
              <div>
                <img
                  src={preview}
                  style={{
                    width: "140px",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "100px",
                  }}
                  alt={preview}
                />
              </div>
            )
          ) : (
            <label
              htmlFor="image"
              style={{
                borderRadius: "100px",
              }}
            >
              <div
                style={{
                  border: "2px dashed grey",
                  borderRadius: "100px",
                }}
                className="p-5"
              >
                <input
                  type="file"
                  id="image"
                  name="image"
                  hidden
                  onChange={handleChange}
                />
                <img src={Cam} width="50px"></img>
              </div>
            </label>
          )}

          <Form.Group className="mb-3 mt-4">
            <Form.Control
              type="text"
              placeholder="Greeting"
              style={{ backgroundColor: "#F4F4F4" }}
              value={form.greeting}
              name="greeting"
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Full Name"
              style={{ backgroundColor: "#F4F4F4" }}
              value={form.name}
              name="name"
              onChange={handleChange}
            />
          </Form.Group>
          <Button
            type="submit"
            style={{ width: "20%", background: "#2FC4B2", border: "none" }}
            className="mt-3"
            onClick={(e) => handleSubmit(e)}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
